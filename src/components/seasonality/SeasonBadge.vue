<template>
  <div class="season-badge">
    <div class="d-flex align-center mb-1">
      <v-icon size="small" class="mr-1">mdi-leaf</v-icon>
      <span class="text-caption font-weight-medium">Seasonality</span>
    </div>
    <v-progress-linear
      :model-value="currentMonthScore"
      :color="getColor(currentMonthScore)"
      height="8"
      rounded
    />
    <div class="text-caption mt-1">
      {{ currentMonthScore }}% this month ({{ currentMonthName }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MonthlyAvailability } from '@/types/recipe'
import { getCurrentMonth, MONTH_NAMES, getMonthIndex } from '@/utils/constants'

const props = defineProps<{
  seasonality: MonthlyAvailability
}>()

const currentMonth = getCurrentMonth()
const currentMonthScore = computed(
  () => props.seasonality[currentMonth as keyof MonthlyAvailability]
)
const currentMonthName = computed(() => MONTH_NAMES[getMonthIndex(currentMonth)])

function getColor(score: number): string {
  if (score >= 70) return 'success'
  if (score >= 40) return 'warning'
  return 'error'
}
</script>

<style scoped>
.season-badge {
  padding: 4px 0;
}
</style>
