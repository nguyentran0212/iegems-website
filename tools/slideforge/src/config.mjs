/**
 * Config schema and validation.
 *
 * The flat schema:
 *
 *   {
 *     "metadata": {
 *       "product": "AFUL Performer 8S",
 *       "imageDir": "Performer8s",
 *       "background": "IMG_20260706_144556987.jpg",
 *       "tagline": "Convoy from Jupiter",
 *       "oneSentenceSummary": "A flagship single-DD with pristine technicalities.",
 *       "footerYear": 2026,
 *       "rating": {                       // optional
 *         "dimensions": {
 *           "Timbre and Tonality": 3.5,
 *           "Bass and Dynamic": 5,
 *           "Resolution": 4.5,
 *           "Soundstage and Imaging": 5
 *         },
 *         "showSeal": false
 *       },
 *       "graph": "graph.png"             // optional (absent for DAC/DAP)
 *     },
 *     "sections": [
 *       { "type": "design-vision",  "images": ["vendor_quote.jpg"] },
 *       { "type": "packaging",      "images": ["a.jpg", "b.jpg"] },
 *       { "type": "frequency-response", "images": ["graph.png"] }
 *     ]
 *   }
 *
 * Required for any build:
 *   - metadata.product
 *   - metadata.imageDir
 *   - metadata.background
 *   - metadata.tagline
 *   - metadata.oneSentenceSummary
 *   - sections[] (at least one)
 *
 * Optional (slide adapts to what's present):
 *   - metadata.rating        -> if present, summary shows radar + stars
 *   - metadata.rating.showSeal -> add the seal badge next to the stars
 *   - metadata.graph          -> if present, summary shows FR graph
 *   - metadata.footerYear     -> copyright year on summary (default: now)
 *
 * `sections[i]` must have `type` and `images`. The type must be a known
 * section type (see section-types.mjs). Image count is validated per-type.
 */

import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

import { getType, isValidType, listTypes } from './section-types.mjs'

export function loadConfig(configPath) {
  const raw = readFileSync(configPath, 'utf8')
  return parseConfig(raw, configPath)
}

export async function loadConfigAsync(configPath) {
  const raw = await readFile(configPath, 'utf8')
  return parseConfig(raw, configPath)
}

export function parseConfig(raw, configPath) {
  let data
  try {
    data = JSON.parse(raw)
  } catch (err) {
    throw new Error(`slideforge: invalid JSON in ${configPath}: ${err.message}`)
  }
  return validateConfig(data, configPath)
}

function validateConfig(cfg, configPath) {
  const errors = []

  // ---- top-level shape ----
  if (!cfg || typeof cfg !== 'object') {
    throw new Error(`slideforge: ${configPath} is not a JSON object`)
  }
  if (!cfg.metadata || typeof cfg.metadata !== 'object') {
    errors.push('"metadata" must be an object')
  }
  if (!Array.isArray(cfg.sections)) {
    errors.push('"sections" must be an array (can be empty if you only want a summary)')
  }

  // ---- metadata ----
  const m = cfg.metadata ?? {}
  if (typeof m.product !== 'string' || !m.product.trim()) {
    errors.push('metadata.product must be a non-empty string')
  }
  if (typeof m.imageDir !== 'string' || !m.imageDir.trim()) {
    errors.push('metadata.imageDir must be a non-empty string')
  }
  if (typeof m.background !== 'string' || !m.background.trim()) {
    errors.push('metadata.background must be a filename for the hero photo')
  }
  if (typeof m.tagline !== 'string' || !m.tagline.trim()) {
    errors.push('metadata.tagline must be a non-empty string (used on the summary slide)')
  }
  if (typeof m.oneSentenceSummary !== 'string' || !m.oneSentenceSummary.trim()) {
    errors.push('metadata.oneSentenceSummary must be a non-empty string (used on the summary slide)')
  }
  if (m.footerYear !== undefined && typeof m.footerYear !== 'number') {
    errors.push('metadata.footerYear must be a number when supplied')
  }
  if (m.graph !== undefined && (typeof m.graph !== 'string' || !m.graph.trim())) {
    errors.push('metadata.graph must be a non-empty filename string when supplied')
  }

  // rating (optional)
  if (m.rating !== undefined) {
    if (typeof m.rating !== 'object' || m.rating === null) {
      errors.push('metadata.rating must be an object with dimensions')
    } else {
      if (!m.rating.dimensions || typeof m.rating.dimensions !== 'object') {
        errors.push('metadata.rating.dimensions must be an object of {name: score}')
      } else {
        for (const [name, score] of Object.entries(m.rating.dimensions)) {
          if (typeof score !== 'number' || score < 0 || score > 5) {
            errors.push(
              `metadata.rating.dimensions.${JSON.stringify(name)} must be a number between 0 and 5 (got ${score})`
            )
          }
        }
      }
      if (m.rating.showSeal !== undefined && typeof m.rating.showSeal !== 'boolean') {
        errors.push('metadata.rating.showSeal must be a boolean when supplied')
      }
    }
  }

  // ---- sections ----
  if (Array.isArray(cfg.sections)) {
    cfg.sections.forEach((s, i) => {
      if (!s || typeof s !== 'object') {
        errors.push(`sections[${i}] must be an object with type and images`)
        return
      }
      if (!isValidType(s.type)) {
        errors.push(
          `sections[${i}].type "${s.type}" is not a known type. Valid: ${listTypes().join(', ')}`
        )
        return
      }
      if (!Array.isArray(s.images) || s.images.length === 0) {
        errors.push(`sections[${i}].images must be a non-empty array of filenames`)
        return
      }
      const def = getType(s.type)
      if (s.images.length < def.minImages || s.images.length > def.maxImages) {
        errors.push(
          `sections[${i}] (type "${s.type}") needs ${def.minImages}-${def.maxImages} image(s), got ${s.images.length}`
        )
        return
      }
      s.images.forEach((img, j) => {
        if (typeof img !== 'string' || !img.trim()) {
          errors.push(`sections[${i}].images[${j}] must be a non-empty filename string`)
        }
      })
    })
  }

  if (errors.length) {
    throw new Error(
      `slideforge: invalid config in ${configPath}:\n  - ` + errors.join('\n  - '),
    )
  }

  // Default footerYear to current year.
  if (m.footerYear === undefined) {
    m.footerYear = new Date().getFullYear()
  }

  cfg._configPath = configPath
  return cfg
}