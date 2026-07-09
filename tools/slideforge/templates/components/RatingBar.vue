<!--
  RatingBar.vue
  ─────────────
  Renders the absolute-rating row for the summary slide:

    ★ ★ ★ ★ ★ (full)        [sealed logo, optional]

  Props
  ─────
  rating : number  - 0 to 5, rounded to the nearest 0.5
  seal   : boolean - whether to show the seal of approval badge
                     (a small circular logo with a gold glow) to the
                     right of the stars. Off by default - only certain
                     IEMs earn it.

  Stars render as 5 slots: N full + (optional 1) half + the rest empty.
  A 4.5 produces 4 full + 1 half. A 3.0 produces 3 full + 2 empty.

  The half star is rendered as a gold ★ with its right half clipped
  off via `clip-path: inset(0 50% 0 0)`. The glyph's full layout box
  is preserved (so the star keeps the same spacing as a full star),
  only the visible pixels are cropped.

  Styling lives in style.css (`.sf-rating`, `.sf-star`, etc.) so the
  user can tweak sizes/colors without touching this component.
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    rating: number
    seal?: boolean
  }>(),
  { seal: false }
)

const rounded = computed(() => Math.round(props.rating * 2) / 2)
const fullStars = computed(() => Math.floor(rounded.value))
const hasHalf = computed(() => rounded.value - fullStars.value === 0.5)
const emptyStars = computed(
  () => 5 - fullStars.value - (hasHalf.value ? 1 : 0)
)
</script>

<template>
  <div class="sf-rating">
    <div class="sf-rating-stars">
      <span v-for="i in fullStars" :key="`f${i}`" class="sf-star full">★</span>
      <span v-if="hasHalf" class="sf-star half">★</span>
      <span v-for="i in emptyStars" :key="`e${i}`" class="sf-star empty">★</span>
    </div>
    <div v-if="seal" class="sf-rating-seal">
      <img src="/logo.png" alt="Seal of approval" />
    </div>
  </div>
</template>