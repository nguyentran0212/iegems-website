/**
 * Markdown builder.
 *
 * Reads the flat config (metadata + sections) and produces a `slides.md`
 * that slidev can render. The output is a hand-curated-looking deck
 * built from small pieces:
 *
 *   - One cover slide per entry in `sections[]`, with the type's auto
 *     header, the global `background`, and the type's image layout
 *   - One summary slide at the end, with the H1, tagline, the radar
 *     (if rating.dimensions present), the FR graph (if graph present),
 *     and the rating row with optional seal
 *
 * The convention: every cover slide uses `class: has-dark-overlay has-logo`,
 * and the summary uses `class: has-gradient-overlay` (no logo). The dark
 * overlay, gradient overlay, logo, and rating widget classes are all
 * defined in `templates/style.css` and the `slide-bottom.vue` global layer.
 *
 * Image paths in the config are bare filenames; we prefix `/<imageDir>/`
 * when emitting them.
 */

import { buildTitle, getType, validateImageCount } from './section-types.mjs'

/**
 * Front-matter for every cover slide. The agent's `sections[i].background`
 * supplies the actual photo.
 */
function coverFrontmatter({ image, classes = 'has-dark-overlay has-logo' }) {
  return [
    '---',
    'theme: default',
    'layout: image',
    `image: ${image}`,
    'backgroundSize: cover',
    `class: ${classes}`,
    '---',
    '',
  ].join('\n')
}

function summaryFrontmatter(image) {
  return [
    '---',
    'theme: default',
    'layout: image',
    `image: ${image}`,
    'backgroundSize: cover',
    'class: has-gradient-overlay',
    '---',
    '',
  ].join('\n')
}

/**
 * Body of a 1-image cover slide. Used by `design-vision`, `generic`, and
 * `frequency-response` types.
 */
function oneImageBody(imageDirBase, image, alt) {
  return [
    `<img :src="\`/${imageDirBase}/${image}\`" class="embedded" />`,
    '',
  ].join('\n')
}

/**
 * Body of a 2-image cover slide (the `.sf-cover-pair` grid). Used by
 * `packaging` (when 2 images) and `frequency-response-comparison`.
 */
function twoImageBody(imageDirBase, images) {
  const cells = images
    .map(
      (img) =>
        `  <div class="sf-cover-cell"><img :src="\`/${imageDirBase}/${img}\`" /></div>`
    )
    .join('\n')
  return [
    '<div class="sf-cover-pair">',
    cells,
    '</div>',
    '',
  ].join('\n')
}

/**
 * Emit one cover slide for a section.
 */
function emitCoverSection({ section, imageDirBase, product, background }) {
  const def = getType(section.type)
  if (!def) {
    // Defensive - the CLI validates before calling us, but guard anyway.
    throw new Error(
      `unknown section type "${section.type}" - valid: design-vision, packaging, generic, frequency-response, frequency-response-comparison`
    )
  }
  validateImageCount(section.type, section.images.length)

  const title = buildTitle(section.type, product)
  const fm = coverFrontmatter({ image: `/${imageDirBase}/${background}` })

  let body
  if (section.images.length === 1) {
    body = `# ${title}\n\n${oneImageBody(imageDirBase, section.images[0], title)}`
  } else {
    body = `# ${title}\n\n${twoImageBody(imageDirBase, section.images)}`
  }

  return `${fm}${body}\n`
}

/**
 * Emit the summary slide. Adapts to what's present in the config:
 *   - rating.dimensions present  -> radar chart
 *   - graph present              -> FR graph
 *   - both absent                -> just the H1 + tagline + one-sentence summary
 */
function emitSummary({ metadata, imageDirBase }) {
  const { product, tagline, oneSentenceSummary, rating, graph } = metadata

  const fm = summaryFrontmatter(`/${imageDirBase}/${metadata.background}`)

  // Build the rating row, if rating + dimensions present.
  const dimensionsJson = rating?.dimensions
    ? JSON.stringify(rating.dimensions)
    : null
  const absoluteRating = computeAbsoluteRating(dimensionsJson)
  const showSeal = !!rating?.showSeal

  let body = `# ${product}\n\n${tagline ?? ''}\n\n${oneSentenceSummary ?? ''}`

  if (absoluteRating !== null) {
    const sealAttr = showSeal ? 'true' : 'false'
    // Wrapped in .sf-rating-corner so it gets pinned to the top-right of
    // the summary slide (see .slidev-layout > .sf-rating-corner in
    // style.css). The wrapper lives before the charts row in source order
    // so it doesn't disturb the natural flow of the rest of the slide.
    body += `\n\n<div class="sf-rating-corner">\n  <RatingBar :rating="${absoluteRating}" :seal="${sealAttr}" />\n</div>`
  }

  // Charts row: optional radar + optional FR graph.
  const hasRadar = dimensionsJson !== null
  const hasFr = typeof graph === 'string' && graph.length > 0
  if (hasRadar || hasFr) {
    body += '\n\n<div class="sf-charts-row">'
    if (hasRadar) {
      body += `\n  <div class="sf-dimension-radar">\n    <DimensionRadar :scores='${dimensionsJson}' />\n  </div>`
    }
    if (hasFr) {
      body += `\n  <div class="sf-fr-graph">\n    <img :src="\`/${imageDirBase}/${graph}\`" alt="Frequency response" />\n  </div>`
    }
    body += '\n</div>'
  }

  return `${fm}${body}\n`
}

function computeAbsoluteRating(dimensionsJson) {
  if (!dimensionsJson) return null
  let dims
  try {
    dims = JSON.parse(dimensionsJson)
  } catch {
    return null
  }
  const values = Object.values(dims).filter((v) => Number.isFinite(Number(v)))
  if (!values.length) return null
  const avg = values.reduce((a, b) => a + Number(b), 0) / values.length
  return Math.round(avg * 2) / 2
}

/**
 * Build the full slides.md for a given config.
 *
 * @param {object} cfg - the parsed config (metadata + sections)
 * @param {string} imageDirBase - bare name like "Performer8s" (no slashes)
 * @returns {string} the markdown content for slides.md
 */
export function buildSlidesMarkdown(cfg, imageDirBase) {
  const { metadata, sections = [] } = cfg

  if (!metadata?.product) {
    throw new Error('config: metadata.product is required')
  }
  if (!metadata?.background) {
    throw new Error('config: metadata.background is required (the hero photo)')
  }

  let out = ''

  for (const section of sections) {
    out += emitCoverSection({
      section,
      imageDirBase,
      product: metadata.product,
      background: metadata.background,
    })
  }

  out += emitSummary({ metadata, imageDirBase })

  return out
}