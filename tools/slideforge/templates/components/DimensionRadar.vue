<!--
  DimensionRadar.vue
  ─────────────────
  Renders a 4-axis radar/spider chart on the summary slide, showing
  the score for each of the four rating dimensions. The chart is the
  exact chart.js config we used in the old monolithic SummarySlide.vue,
  just lifted out into its own component so the slide markdown can stay
  pure.

  Props
  ─────
  scores : { [dimension: string]: number } - 4 scores, one per
           dimension. All four keys must be present (others default to
           0 if missing). Each score is 0-5.

  The component handles its own data shape and labels. Styling (size,
  margin) lives in style.css via `.sf-dimension-radar`.

  Dimension order is fixed so the chart's geometry doesn't reshuffle
  if the config order changes.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  scores: Record<string, number>
}>()

// Fixed dimension order so the polygon vertices stay in the same place
// across slides even if the input object is keyed differently.
const DIMS = [
  'Timbre and Tonality',
  'Bass and Dynamic',
  'Resolution',
  'Soundstage and Imaging',
] as const

// Short labels for the radar so they don't clip on a small canvas.
const SHORT_DIM_LABELS: Record<string, string> = {
  'Timbre and Tonality': 'Tonality',
  'Bass and Dynamic': 'Bass',
  'Soundstage and Imaging': 'Soundstage',
  Resolution: 'Resolution',
}

const labels = computed(() => DIMS.map((d) => SHORT_DIM_LABELS[d] ?? d))
const values = computed(() => DIMS.map((d) => Number(props.scores?.[d] ?? 0)))

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      backgroundColor: 'rgba(212, 175, 55, 0.20)',
      borderColor: 'rgb(212, 175, 55)',
      pointBackgroundColor: 'rgb(212, 175, 55)',
      pointBorderColor: '#000',
      pointHoverBackgroundColor: '#000',
      pointHoverBorderColor: 'rgb(212, 175, 55)',
      borderWidth: 2,
      pointRadius: 4,
      data: values.value,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  // Tight outer padding so the data fills more of the canvas. Labels
  // still have room because the wrapper is sized generously.
  layout: { padding: 4 },
  scales: {
    r: {
      min: 0,
      max: 5,
      ticks: { display: false },
      grid: { color: 'rgba(255,255,255,0.18)' },
      angleLines: { color: 'rgba(255,255,255,0.18)' },
      pointLabels: {
        color: '#fff',
        font: { size: 14, weight: '500' },
        padding: 6,
        centerPointLabels: false,
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
}))
</script>

<template>
  <Radar :data="chartData" :options="chartOptions" />
</template>