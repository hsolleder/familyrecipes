<template>
  <div class="monthly-chart">
    <div class="text-h6 mb-3">Monthly Seasonality</div>
    <div class="chart-container">
      <div v-for="(month, index) in MONTHS" :key="month" class="month-bar">
        <div class="month-label">{{ MONTH_NAMES[index].substring(0, 3) }}</div>
        <div class="bar-container">
          <div
            class="bar"
            :class="{
              'bar-in-season': seasonality[month] >= 70,
              'bar-current': isCurrentMonth(month)
            }"
            :style="{ height: `${seasonality[month]}%` }"
          >
            <div v-if="seasonality[month] > 0" class="bar-value">{{ seasonality[month] }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MonthlyAvailability } from '@/types/recipe'
import { MONTHS, MONTH_NAMES, getCurrentMonth } from '@/utils/constants'

defineProps<{
  seasonality: MonthlyAvailability
}>()

function isCurrentMonth(month: string): boolean {
  return month === getCurrentMonth()
}
</script>

<style scoped>
.monthly-chart {
  padding: 16px;
}

.chart-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  border-bottom: 2px solid #e0e0e0;
  padding: 0 8px;
}

.month-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 2px;
}

.bar-container {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 100%;
  background-color: #ffcdd2;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
  position: relative;
  min-height: 4px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.bar-in-season {
  background-color: #81c784;
}

.bar-current {
  outline: 2px solid #1976d2;
  outline-offset: -2px;
}

.bar-value {
  font-size: 10px;
  font-weight: 500;
  padding: 2px;
  color: #333;
}

.month-label {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}
</style>
