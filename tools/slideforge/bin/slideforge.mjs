#!/usr/bin/env node
/**
 * Slideforge CLI.
 *
 * Subcommands (agent-facing, for incremental JSON building):
 *   init <imageDir> --product "<name>" [--background <file>] [--graph <file>]
 *     Create slideforge.json with product + imageDir (and optionally the
 *     hero background and the FR graph).
 *
 *   set tagline <imageDir> --text "..."   (or --unset)
 *   set summary <imageDir> --text "..."   (or --unset)
 *   set background <imageDir> --file <file>
 *   set graph <imageDir> --file <file>    (or --unset)
 *   set rating <imageDir> --dimension "<name>" --score <0-5>   (or --unset --dimension "<name>")
 *     Mutate one metadata field at a time. The agent calls these as it
 *     learns the inputs. --unset removes a field (or a single dimension
 *     for `set rating`).
 *
 *   add section <imageDir> --type <type> --images <file1[,file2,...]>
 *     Append a section. Validates the type, image count, and that every
 *     image file exists in <imageDir> - throws immediately on any failure.
 *
 *   remove section <imageDir> --index <n>   (or --last)
 *     Delete a section by 0-based index. Use `slideforge show` to find the index.
 *
 *   build <imageDir> [--outDir <dir>]
 *     Generate slides.md, run slidev export, copy slide_*.png next to the
 *     source images (or to --outDir if given).
 *
 *   show <imageDir>
 *     Pretty-print the current slideforge.json.
 *
 *   serve <imageDir> [--port <port>] [--open]
 *     Spin up the slidev dev server against the generated slides. Preview
 *     in a browser, no PNGs written.
 *
 *   example <imageDir>
 *     Write a sample slideforge.example.json (full schema with placeholders).
 *
 *   clean <imageDir> [--scratch]
 *     Remove generated slide_*.png from the image directory. With --scratch,
 *     also remove the slidev build/serve scratch dirs.
 */
import path from 'node:path'
import { existsSync } from 'node:fs'

import {
  addSectionCommand,
  buildCommand,
  cleanCommand,
  exampleCommand,
  initCommand,
  removeSectionCommand,
  setCommand,
  showCommand,
} from '../src/commands.mjs'
import { runSlidevServe } from '../src/runner.mjs'
import { printUsage } from '../src/help.mjs'

const cwd = process.cwd()

/**
 * Resolve a bare imageDir like "Performer8s" to "assets/images/Performer8s".
 * If the user already gave a path (./foo, ../foo, /abs/foo, assets/...), use as-is.
 */
function resolveImageDir(input) {
  if (!input) return null
  if (path.isAbsolute(input)) return input
  if (input.startsWith('./') || input.startsWith('../')) {
    return path.resolve(cwd, input)
  }
  // Bare name: assume it's a product slug under assets/images/.
  return path.resolve(cwd, 'assets', 'images', input)
}

function parseArgs(argv) {
  // First non-flag is the command; the rest of the non-flag args go to
  // positional[]. Commands with a sub (set, add, remove) put the sub as
  // positional[0] and the imageDir as positional[1]; commands without
  // a sub put the imageDir directly at positional[0].
  const out = { cmd: null, positional: [], flags: {} }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') {
      out.flags.help = true
    } else if (a === '--product') out.flags.product = argv[++i]
    else if (a === '--background') out.flags.background = argv[++i]
    else if (a === '--graph') out.flags.graph = argv[++i]
    else if (a === '--text') out.flags.text = argv[++i]
    else if (a === '--file') out.flags.file = argv[++i]
    else if (a === '--type') out.flags.type = argv[++i]
    else if (a === '--images') out.flags.images = argv[++i]
    else if (a === '--dimension') out.flags.dimension = argv[++i]
    else if (a === '--score') out.flags.score = argv[++i]
    else if (a === '--index') out.flags.index = argv[++i]
    else if (a === '--outDir') out.flags.outDir = argv[++i]
    else if (a === '--port') out.flags.port = parseInt(argv[++i], 10)
    else if (a === '--open') out.flags.open = true
    else if (a === '--unset') out.flags.unset = true
    else if (a === '--last') out.flags.last = true
    else if (a === '--scratch') out.flags.scratch = true
    else if (a.startsWith('--')) out.flags[a.slice(2)] = true
    else {
      if (out.cmd === null) out.cmd = a
      else out.positional.push(a)
    }
  }
  return out
}

const args = parseArgs(process.argv.slice(2))

if (args.flags.help || !args.cmd) {
  printUsage()
  process.exit(args.flags.help ? 0 : 1)
}

// Commands whose positional[0] is a subcommand, positional[1] is the
// imageDir. Everything else: positional[0] is the imageDir directly.
const COMMANDS_WITH_SUB = new Set(['set', 'add', 'remove'])
function getImageDir() {
  const idx = COMMANDS_WITH_SUB.has(args.cmd) ? 1 : 0
  return resolveImageDir(args.positional[idx])
}

function requireImageDir() {
  const imageDir = getImageDir()
  if (!imageDir) {
    console.error(`slideforge: missing <imageDir> for "${args.cmd}"`)
    printUsage()
    process.exit(2)
  }
  if (!existsSync(imageDir)) {
    console.error(`slideforge: image directory does not exist: ${imageDir}`)
    process.exit(2)
  }
  return imageDir
}

async function main() {
  switch (args.cmd) {
    case 'init': {
      const imageDir = requireImageDir()
      const cfg = await initCommand(imageDir, {
        product: args.flags.product,
        background: args.flags.background,
        graph: args.flags.graph,
      })
      console.log(`slideforge: wrote ${path.join(imageDir, 'slideforge.json')}`)
      console.log(JSON.stringify(cfg, null, 2))
      return
    }

    case 'set': {
      const field = args.positional[0]
      if (!field) {
        console.error('slideforge: "set" needs a subfield: tagline | summary | background | graph | rating')
        process.exit(2)
      }
      const imageDir = requireImageDir()
      await setCommand(imageDir, field, {
        text: args.flags.text,
        file: args.flags.file,
        dimension: args.flags.dimension,
        score: args.flags.score,
        unset: !!args.flags.unset,
      })
      const verb = args.flags.unset ? 'unset' : 'updated'
      console.log(`slideforge: ${verb} ${field} in ${imageDir}/slideforge.json`)
      return
    }

    case 'add': {
      if (args.positional[0] !== 'section') {
        console.error('slideforge: "add" only supports: add section')
        process.exit(2)
      }
      const imageDir = requireImageDir()
      const cfg = await addSectionCommand(imageDir, {
        type: args.flags.type,
        images: args.flags.images,
      })
      console.log(
        `slideforge: appended section "${args.flags.type}" (${args.flags.images}) to ${imageDir}/slideforge.json (now ${cfg.sections.length} section(s))`
      )
      return
    }

    case 'remove': {
      if (args.positional[0] !== 'section') {
        console.error('slideforge: "remove" only supports: remove section')
        process.exit(2)
      }
      const imageDir = requireImageDir()
      const { cfg, removed, index } = await removeSectionCommand(imageDir, {
        index: args.flags.index,
        last: !!args.flags.last,
      })
      console.log(
        `slideforge: removed section #${index} ("${removed.type}", ${removed.images.join(', ')}) from ${imageDir}/slideforge.json (now ${cfg.sections.length} section(s))`
      )
      return
    }

    case 'build': {
      const imageDir = requireImageDir()
      const outDir = args.flags.outDir
        ? path.resolve(cwd, args.flags.outDir)
        : imageDir
      const { outputs } = await buildCommand(imageDir, { outDir })
      console.log(`slideforge: ${outputs.length} PNG(s) written to ${outDir}`)
      for (const o of outputs) console.log(`  - ${o}`)
      return
    }

    case 'show': {
      const imageDir = requireImageDir()
      const cfg = await showCommand(imageDir)
      console.log(JSON.stringify(cfg, null, 2))
      return
    }

    case 'serve': {
      const imageDir = requireImageDir()
      const port = args.flags.port || 3030
      const { loadConfig } = await import('../src/config.mjs')
      const { buildSlidesMarkdown } = await import('../src/markdown.mjs')
      const cfg = loadConfig(path.join(imageDir, 'slideforge.json'))
      const markdown = buildSlidesMarkdown(cfg, cfg.metadata.imageDir)
      const scratchDir = path.join(
        path.resolve(imageDir, '..', '..', '..'),
        'tools', 'slideforge', 'scratch', '_serve_' + cfg.metadata.imageDir
      )
      await runSlidevServe({
        scratchDir,
        markdown,
        imageDir,
        imageDirBase: cfg.metadata.imageDir,
        port,
        open: !!args.flags.open,
      })
      return
    }

    case 'example': {
      const imageDir = requireImageDir()
      const target = await exampleCommand(imageDir)
      console.log(`slideforge: wrote ${target}`)
      return
    }

    case 'clean': {
      const imageDir = requireImageDir()
      const removed = await cleanCommand(imageDir, {
        scratch: !!args.flags.scratch,
      })
      const parts = []
      if (removed.pngs > 0) parts.push(`${removed.pngs} PNG(s) from ${imageDir}`)
      if (removed.scratchDirs > 0) parts.push(`${removed.scratchDirs} scratch dir(s)`)
      if (parts.length === 0) {
        console.log(`slideforge: nothing to clean in ${imageDir}${args.flags.scratch ? ' (no scratch dirs)' : ''}`)
      } else {
        console.log(`slideforge: removed ${parts.join(' and ')}`)
      }
      return
    }

    default:
      console.error(`slideforge: unknown command "${args.cmd}"`)
      printUsage()
      process.exit(2)
  }
}

main().catch((err) => {
  console.error(`slideforge: ${err && err.message ? err.message : String(err)}`)
  if (process.env.SLIDEFORGE_DEBUG) {
    console.error(err && err.stack)
  }
  process.exit(1)
})