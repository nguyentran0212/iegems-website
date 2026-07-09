<!--
  slide-bottom.vue
  ────────────────
  Per-slide layer (one instance per slide). Renders the In-ear Gems
  seal in the bottom-right corner for slides whose `class:` frontmatter
  includes `has-logo`. The summary slide omits that token and renders
  without a logo.
-->
<script setup lang="ts">
import { inject } from 'vue'

const frontmatter = inject<Record<string, any>>('$$slidev-fontmatter', {})
const klass = (frontmatter?.class ?? '') as string
const showLogo = klass.split(/\s+/).includes('has-logo')
</script>

<template>
  <div v-if="showLogo" class="sf-logo">
    <img src="/logo.png" alt="In-ear Gems" />
  </div>
</template>