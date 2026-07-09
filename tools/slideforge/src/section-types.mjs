/**
 * Section-type registry.
 *
 * Each entry maps a section `type` (what the agent writes in the config)
 * to a header string and image-count constraints. The markdown builder
 * looks up the type here to generate the slide.
 *
 * Header format is universal: `${header} | {product}`. For `generic`,
 * the header string is empty, so the H1 is just the product name.
 *
 * To add a new type: add an entry here. The CLI rejects unknown types
 * with a list of valid ones.
 */

export const SECTION_TYPES = {
  'design-vision': {
    header: 'DESIGN VISION',
    minImages: 1,
    maxImages: 1,
  },
  'packaging': {
    header: 'PACKAGING',
    minImages: 1,
    maxImages: 2,
  },
  'generic': {
    header: '',
    minImages: 1,
    maxImages: 1,
  },
  'frequency-response': {
    header: 'FREQUENCY RESPONSE',
    minImages: 1,
    maxImages: 1,
  },
  'frequency-response-comparison': {
    header: 'FREQUENCY RESPONSE COMPARISON',
    minImages: 2,
    maxImages: 2,
  },
}

export function isValidType(type) {
  return Object.prototype.hasOwnProperty.call(SECTION_TYPES, type)
}

export function listTypes() {
  return Object.keys(SECTION_TYPES)
}

export function getType(type) {
  return SECTION_TYPES[type] || null
}

/**
 * Validate a section's image count against its type's constraints.
 * Throws with a helpful message on failure.
 */
export function validateImageCount(type, imageCount) {
  const def = getType(type)
  if (!def) {
    throw new Error(
      `unknown section type "${type}" - valid types: ${listTypes().join(', ')}`
    )
  }
  if (imageCount < def.minImages) {
    throw new Error(
      `section type "${type}" needs at least ${def.minImages} image(s), got ${imageCount}`
    )
  }
  if (imageCount > def.maxImages) {
    throw new Error(
      `section type "${type}" accepts at most ${def.maxImages} image(s), got ${imageCount}`
    )
  }
}

/**
 * Construct the full slide title from a type's header + the product name.
 */
export function buildTitle(type, product) {
  const def = getType(type)
  if (!def) return product
  if (!def.header) return product
  return `${def.header} | ${product}`
}