/**
 * Agent-facing CLI subcommands.
 *
 * Each function takes the resolved image directory and a parsed-options
 * object, then either mutates slideforge.json (init / set / add-section)
 * or builds the slides (build). All of them throw on validation failure
 * with a clear, single-line error message - the agent should be able to
 * read the error and fix the input.
 *
 * The config file lives at `<imageDir>/slideforge.json`. We load it,
 * mutate, write it back atomically (write to a temp file, then rename).
 */

import { existsSync, readFileSync, readdirSync, unlinkSync } from 'node:fs'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { loadConfig } from './config.mjs'
import { buildSlidesMarkdown } from './markdown.mjs'
import { runSlidevBuild } from './runner.mjs'
import {
  isValidType,
  listTypes,
  validateImageCount,
} from './section-types.mjs'

function configPath(imageDir) {
  return path.join(imageDir, 'slideforge.json')
}

async function readConfig(imageDir) {
  const p = configPath(imageDir)
  if (!existsSync(p)) {
    return null
  }
  const raw = await readFile(p, 'utf8')
  // Read raw JSON (don't go through the strict validator). Each set/add
  // command writes through writeConfig which does call the validator
  // for the partial state it's modifying. The full validation runs at
  // build time.
  return JSON.parse(raw)
}

async function writeConfig(imageDir, cfg) {
  await mkdir(imageDir, { recursive: true })
  const p = configPath(imageDir)
  const tmp = `${p}.tmp`
  const json = JSON.stringify(cfg, null, 2) + '\n'
  await writeFile(tmp, json, 'utf8')
  await rename(tmp, p)
}

function fileExists(imageDir, filename) {
  // The agent supplies bare filenames; the CLI checks they exist in <imageDir>.
  return existsSync(path.join(imageDir, filename))
}

/* -------------------------------------------------------------------------- */
/* init                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Create an initial slideforge.json. Product + imageDir are required.
 * Background and graph are optional and can be set later via `set`.
 */
export async function initCommand(imageDir, { product, background, graph }) {
  if (!product || typeof product !== 'string') {
    throw new Error('init: --product is required and must be a non-empty string')
  }

  await mkdir(imageDir, { recursive: true })

  if (existsSync(configPath(imageDir))) {
    throw new Error(
      `init: ${configPath(imageDir)} already exists. Delete it first or use a different image directory.`
    )
  }

  if (background && !fileExists(imageDir, background)) {
    throw new Error(
      `init: --background "${background}" does not exist in ${imageDir}`
    )
  }
  if (graph && !fileExists(imageDir, graph)) {
    throw new Error(
      `init: --graph "${graph}" does not exist in ${imageDir}`
    )
  }

  const cfg = {
    metadata: {
      product: product.trim(),
      imageDir: path.basename(imageDir),
      ...(background ? { background } : {}),
      ...(graph ? { graph } : {}),
    },
    sections: [],
  }

  // Validate by going through the same validator. This will also pick up
  // any defaulting (e.g. footerYear).
  // Note: we DO NOT call parseConfig here because the init config is
  // intentionally partial (tagline, oneSentenceSummary, sections are
  // added later via `set` and `add section`). The full validation runs
  // at `build` time.
  await writeConfig(imageDir, cfg)

  return cfg
}

/* -------------------------------------------------------------------------- */
/* set                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Set a single metadata field. Supported fields:
 *   tagline, summary, background, graph, rating
 *
 * For rating, each call sets ONE dimension (--dimension + --score).
 */
export async function setCommand(imageDir, field, opts) {
  const cfg = await readConfig(imageDir)
  if (!cfg) {
    throw new Error(
      `set: no slideforge.json at ${configPath(imageDir)}. Run "slideforge init" first.`
    )
  }

  switch (field) {
    case 'tagline':
      if (opts.unset) return unsetField(imageDir, cfg, 'tagline', 'tagline')
      return setText(imageDir, cfg, 'tagline', opts.text, 'tagline (short line under the summary title)')
    case 'summary':
      if (opts.unset) return unsetField(imageDir, cfg, 'oneSentenceSummary', 'summary')
      return setText(imageDir, cfg, 'oneSentenceSummary', opts.text, 'one-sentence summary (the placeholder paragraph)')
    case 'background':
      // Background is required by `build`; no unset for it. Use `init` in a
      // new directory if you want a different background.
      return setFile(imageDir, cfg, 'background', opts.file, 'hero background photo')
    case 'graph':
      if (opts.unset) return unsetField(imageDir, cfg, 'graph', 'graph')
      return setFile(imageDir, cfg, 'graph', opts.file, 'frequency-response graph')
    case 'rating':
      if (opts.unset) return unsetRatingDimension(imageDir, cfg, opts.dimension)
      return setRatingDimension(imageDir, cfg, opts.dimension, opts.score)
    default:
      throw new Error(
        `set: unknown field "${field}". Valid: tagline, summary, background, graph, rating`
      )
  }
}

async function setText(imageDir, cfg, key, text, description) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error(`set ${key}: --text is required (${description})`)
  }
  cfg.metadata[key] = text.trim()
  await writeConfig(imageDir, cfg)
  return cfg
}

async function setFile(imageDir, cfg, key, filename, description) {
  if (typeof filename !== 'string' || !filename.trim()) {
    throw new Error(`set ${key}: --file is required (${description})`)
  }
  if (!fileExists(imageDir, filename)) {
    throw new Error(
      `set ${key}: file "${filename}" does not exist in ${imageDir}`
    )
  }
  cfg.metadata[key] = filename.trim()
  await writeConfig(imageDir, cfg)
  return cfg
}

async function setRatingDimension(imageDir, cfg, dimension, score) {
  if (typeof dimension !== 'string' || !dimension.trim()) {
    throw new Error('set rating: --dimension is required (e.g. "Timbre and Tonality")')
  }
  const n = Number(score)
  if (!Number.isFinite(n) || n < 0 || n > 5) {
    throw new Error(
      `set rating: --score must be a number between 0 and 5 (got ${JSON.stringify(score)})`
    )
  }

  if (!cfg.metadata.rating) {
    cfg.metadata.rating = { dimensions: {} }
  }
  cfg.metadata.rating.dimensions = cfg.metadata.rating.dimensions || {}
  cfg.metadata.rating.dimensions[dimension.trim()] = n
  await writeConfig(imageDir, cfg)
  return cfg
}

/**
 * Remove a top-level metadata field. Used by `set <field> --unset` for
 * tagline, summary, graph. Throws if the field is already absent so the
 * agent gets a clear error instead of a silent no-op.
 */
async function unsetField(imageDir, cfg, key, displayName) {
  if (!(key in cfg.metadata)) {
    throw new Error(
      `unset ${displayName}: field is already absent. Nothing to remove.`
    )
  }
  delete cfg.metadata[key]
  await writeConfig(imageDir, cfg)
  return cfg
}

/**
 * Remove a single rating dimension. If the dimensions object becomes
 * empty, drop the whole `rating` object so the config is clean.
 */
async function unsetRatingDimension(imageDir, cfg, dimension) {
  if (typeof dimension !== 'string' || !dimension.trim()) {
    throw new Error('unset rating: --dimension is required (e.g. "Timbre and Tonality")')
  }
  if (!cfg.metadata?.rating?.dimensions) {
    throw new Error('unset rating: rating is not set. Nothing to remove.')
  }
  const dim = dimension.trim()
  if (!(dim in cfg.metadata.rating.dimensions)) {
    throw new Error(
      `unset rating: dimension "${dim}" is not set. Nothing to remove. (current: ${Object.keys(cfg.metadata.rating.dimensions).join(', ')})`
    )
  }
  delete cfg.metadata.rating.dimensions[dim]
  if (Object.keys(cfg.metadata.rating.dimensions).length === 0) {
    delete cfg.metadata.rating
  }
  await writeConfig(imageDir, cfg)
  return cfg
}

/* -------------------------------------------------------------------------- */
/* add section                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Append a section to the config. Validates:
 *   - the type is a known section type
 *   - the image count matches the type's min/max
 *   - each image file exists in imageDir
 *
 * On any failure, throws immediately so the agent knows the input is wrong.
 */
export async function addSectionCommand(imageDir, opts) {
  const cfg = await readConfig(imageDir)
  if (!cfg) {
    throw new Error(
      `add section: no slideforge.json at ${configPath(imageDir)}. Run "slideforge init" first.`
    )
  }

  const { type, images } = opts

  if (typeof type !== 'string' || !type.trim()) {
    throw new Error(
      `add section: --type is required. Valid: ${listTypes().join(', ')}`
    )
  }
  if (!isValidType(type)) {
    throw new Error(
      `add section: unknown type "${type}". Valid: ${listTypes().join(', ')}`
    )
  }

  // Normalize images: accept array, single string, or comma-separated string.
  let imgList
  if (Array.isArray(images)) {
    imgList = images
  } else if (typeof images === 'string') {
    imgList = images.split(',').map((s) => s.trim()).filter(Boolean)
  } else {
    throw new Error('add section: --images is required (comma-separated filenames)')
  }
  if (imgList.length === 0) {
    throw new Error('add section: --images must contain at least one filename')
  }

  // Validate image count BEFORE checking file existence, so the agent gets
  // the more useful error first.
  validateImageCount(type, imgList.length)

  // Validate every file exists.
  for (const img of imgList) {
    if (!fileExists(imageDir, img)) {
      throw new Error(
        `add section: image "${img}" does not exist in ${imageDir}`
      )
    }
  }

  cfg.sections = cfg.sections || []
  cfg.sections.push({ type, images: imgList })
  await writeConfig(imageDir, cfg)
  return cfg
}

/* -------------------------------------------------------------------------- */
/* remove section                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Delete a section from the config by index (0-based) or by `--last`.
 *
 * Use `slideforge show <imageDir>` to see the current sections and their
 * implicit 0-based indices.
 */
export async function removeSectionCommand(imageDir, opts) {
  const cfg = await readConfig(imageDir)
  if (!cfg) {
    throw new Error(
      `remove section: no slideforge.json at ${configPath(imageDir)}. Run "slideforge init" first.`
    )
  }
  if (!Array.isArray(cfg.sections) || cfg.sections.length === 0) {
    throw new Error('remove section: sections[] is empty. Nothing to remove.')
  }

  const { index, last } = opts
  if (index === undefined && !last) {
    throw new Error(
      `remove section: --index <n> (0-based) or --last is required. Current sections: 0..${cfg.sections.length - 1}.`
    )
  }
  if (index !== undefined && last) {
    throw new Error('remove section: pass either --index or --last, not both.')
  }

  let idx
  if (last) {
    idx = cfg.sections.length - 1
  } else {
    const n = Number(index)
    if (!Number.isInteger(n) || n < 0 || n >= cfg.sections.length) {
      throw new Error(
        `remove section: --index must be an integer between 0 and ${cfg.sections.length - 1}. Got: ${JSON.stringify(index)}`
      )
    }
    idx = n
  }

  const removed = cfg.sections.splice(idx, 1)[0]
  await writeConfig(imageDir, cfg)
  return { cfg, removed, index: idx }
}

/* -------------------------------------------------------------------------- */
/* build                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Generate slides.md, run slidev export, copy PNGs to the image directory.
 *
 * Validation: the config must have at least one section, plus the metadata
 * fields needed for the cover slides and the summary. The CLI surfaces
 * clear errors when something is missing.
 */
export async function buildCommand(imageDir, opts = {}) {
  const cfg = await readConfig(imageDir)
  if (!cfg) {
    throw new Error(
      `build: no slideforge.json at ${configPath(imageDir)}. Run "slideforge init" first.`
    )
  }

  if (!Array.isArray(cfg.sections) || cfg.sections.length === 0) {
    throw new Error(
      'build: sections[] is empty. Add at least one section with "slideforge add section" before building.'
    )
  }

  // For the summary we need a tagline + oneSentenceSummary at minimum.
  // The summary is the last slide and is always generated.
  if (!cfg.metadata?.tagline) {
    throw new Error('build: metadata.tagline is required (used on the summary slide)')
  }
  if (!cfg.metadata?.oneSentenceSummary) {
    throw new Error('build: metadata.oneSentenceSummary is required')
  }
  if (!cfg.metadata?.background) {
    throw new Error('build: metadata.background is required (used as the hero photo for cover and summary)')
  }

  // Every section's imageDirBase is the metadata.imageDir (resolved).
  const imageDirBase = cfg.metadata.imageDir
  const markdown = buildSlidesMarkdown(cfg, imageDirBase)

  // Reuse the existing runner to scaffold the project + run slidev export.
  const scratchDir = path.join(
    path.resolve(imageDir, '..', '..', '..'),
    'tools',
    'slideforge',
    'scratch',
    '_build_' + imageDirBase
  )

  const pngPaths = await runSlidevBuild({
    scratchDir,
    markdown,
    imageDir,
    imageDirBase,
    logger: console,
  })

  // Copy + rename to slide_1.png, slide_2.png, ... in the image directory.
  const targetDir = opts.outDir || imageDir
  const outputs = []
  for (let i = 0; i < pngPaths.length; i++) {
    const target = path.join(targetDir, `slide_${i + 1}.png`)
    const { copyFile } = await import('node:fs/promises')
    await copyFile(pngPaths[i], target)
    outputs.push(target)
  }
  return { outputs, scratchDir }
}

/* -------------------------------------------------------------------------- */
/* clean                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Compute the path to the scratch build dir for a given imageDir.
 * Mirrors the path computation in `buildCommand` so `clean --scratch`
 * finds the same dir that `build` creates.
 */
export function scratchDirFor(imageDir, prefix = '_build_') {
  return path.join(
    path.resolve(imageDir, '..', '..', '..'),
    'tools',
    'slideforge',
    'scratch',
    prefix + path.basename(imageDir),
  )
}

/**
 * Remove generated artefacts for an image directory.
 *
 * Default: remove `slide_*.png` from <imageDir>.
 * With `--scratch`: also remove the slidev build/serve scratch dirs
 * (the dirs created by `slideforge build` and `slideforge serve`).
 * `scratchOnly` removes only the scratch dirs and leaves the image
 * directory's PNGs in place.
 */
export async function cleanCommand(imageDir, opts = {}) {
  const { scratchOnly = false, scratch = false } = opts
  const removed = { pngs: 0, scratchDirs: 0, paths: [] }

  if (!scratchOnly) {
    const entries = readdirSync(imageDir)
    for (const name of entries) {
      if (/^slide_\d+\.png$/.test(name)) {
        try {
          unlinkSync(path.join(imageDir, name))
          removed.pngs++
          removed.paths.push(path.join(imageDir, name))
        } catch {}
      }
    }
  }

  if (scratch || scratchOnly) {
    for (const prefix of ['_build_', '_serve_']) {
      const target = scratchDirFor(imageDir, prefix)
      if (existsSync(target)) {
        try {
          await rm(target, { recursive: true, force: true })
          removed.scratchDirs++
          removed.paths.push(target)
        } catch {}
      }
    }
  }

  return removed
}

/* -------------------------------------------------------------------------- */
/* read-only helpers                                                          */
/* -------------------------------------------------------------------------- */

export async function showCommand(imageDir) {
  const cfg = await readConfig(imageDir)
  if (!cfg) {
    throw new Error(
      `show: no slideforge.json at ${configPath(imageDir)}.`
    )
  }
  return cfg
}

/* -------------------------------------------------------------------------- */
/* example                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Write a sample `slideforge.example.json` (not `slideforge.json`) into
 * the image directory. The file uses the current flat schema with
 * placeholder strings, so an agent can copy it, fill in the real
 * values, and rename it to `slideforge.json` to start a build.
 *
 * The file is written as `*.example.json` so it won't be picked up by
 * `init` or `build` if left in place.
 */
export async function exampleCommand(imageDir) {
  const target = path.join(imageDir, 'slideforge.example.json')
  const sample = {
    metadata: {
      product: 'CHANGE ME - full product name (e.g. "AFUL Performer 8S")',
      imageDir: path.basename(imageDir),
      background: 'CHANGE_ME_hero.jpg',
      tagline: 'CHANGE ME - short tagline shown under the summary title',
      oneSentenceSummary:
        'CHANGE ME - one-sentence summary shown in the placeholder paragraph.',
      footerYear: new Date().getFullYear(),
      rating: {
        dimensions: {
          'Timbre and Tonality': 4.0,
          'Bass and Dynamic': 4.0,
          'Resolution': 4.0,
          'Soundstage and Imaging': 4.0,
        },
        showSeal: false,
      },
      graph: 'CHANGE_ME_graph.png',
    },
    sections: [
      { type: 'design-vision', images: ['CHANGE_ME_vendor_quote.jpg'] },
      { type: 'packaging', images: ['CHANGE_ME_box1.jpg', 'CHANGE_ME_box2.jpg'] },
      { type: 'frequency-response', images: ['CHANGE_ME_graph.png'] },
    ],
  }
  await mkdir(imageDir, { recursive: true })
  await writeFile(target, JSON.stringify(sample, null, 2) + '\n', 'utf8')
  return target
}
