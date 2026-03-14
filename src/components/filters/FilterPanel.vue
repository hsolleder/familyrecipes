<template>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-filter-variant</v-icon>
          <span class="font-weight-medium">Filters</span>
          <v-chip v-if="filtersStore.hasActiveFilters" size="small" color="primary" class="ml-2">
            {{ activeFilterCount }}
          </v-chip>
        </div>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row>
          <!-- Ingredient Filter -->
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="filtersStore.ingredients"
              :items="ingredientNames"
              label="Filter by Ingredients"
              prepend-inner-icon="mdi-food-apple"
              chips
              closable-chips
              multiple
              clearable
              hide-details
            />
          </v-col>

          <!-- Source Book Filter -->
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="filtersStore.sourceBooks"
              :items="sourceBooks"
              label="Filter by Source Book"
              prepend-inner-icon="mdi-book-open-variant"
              chips
              closable-chips
              multiple
              clearable
              hide-details
            />
          </v-col>

          <!-- Category Filter -->
          <v-col cols="12" md="6">
            <v-select
              v-model="filtersStore.categories"
              :items="CATEGORIES"
              label="Filter by Category"
              prepend-inner-icon="mdi-tag"
              chips
              closable-chips
              multiple
              clearable
              hide-details
            />
          </v-col>

          <!-- Tag Filter -->
          <v-col cols="12" md="6">
            <v-select
              v-model="filtersStore.tags"
              :items="TAGS"
              label="Filter by Tags"
              prepend-inner-icon="mdi-tag-outline"
              chips
              closable-chips
              multiple
              clearable
              hide-details
            />
          </v-col>

          <!-- Preparation Time Slider -->
          <v-col cols="12" md="6">
            <div class="px-2">
              <div class="text-subtitle-2 mb-2">
                <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                Max Preparation Time: {{ formatTime(filtersStore.maxPrepTime) }}
              </div>
              <v-slider
                v-model="filtersStore.maxPrepTime"
                :min="0"
                :max="180"
                :step="5"
                thumb-label
                hide-details
              >
                <template #thumb-label="{ modelValue }">
                  {{ formatTime(modelValue) }}
                </template>
              </v-slider>
            </div>
          </v-col>

          <!-- Total Time Slider -->
          <v-col cols="12" md="6">
            <div class="px-2">
              <div class="text-subtitle-2 mb-2">
                <v-icon size="small" class="mr-1">mdi-clock-end</v-icon>
                Max Total Time: {{ formatTime(filtersStore.maxTotalTime) }}
              </div>
              <v-slider
                v-model="filtersStore.maxTotalTime"
                :min="0"
                :max="300"
                :step="5"
                thumb-label
                hide-details
              >
                <template #thumb-label="{ modelValue }">
                  {{ formatTime(modelValue) }}
                </template>
              </v-slider>
            </div>
          </v-col>

          <!-- Seasonal Toggle -->
          <v-col cols="12">
            <v-switch
              v-model="filtersStore.seasonalThisMonth"
              label="Show only seasonal recipes for this month"
              color="success"
              prepend-icon="mdi-leaf"
              hide-details
            />
          </v-col>

          <!-- Reset Button -->
          <v-col cols="12">
            <v-btn
              v-if="filtersStore.hasActiveFilters"
              block
              variant="outlined"
              color="error"
              prepend-icon="mdi-filter-off"
              @click="filtersStore.resetFilters"
            >
              Clear All Filters
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import { useIngredientsStore } from '@/stores/ingredients'
import { useRecipesStore } from '@/stores/recipes'
import { CATEGORIES, TAGS } from '@/utils/constants'
import { formatTime } from '@/utils/time'

const filtersStore = useFiltersStore()
const ingredientsStore = useIngredientsStore()
const recipesStore = useRecipesStore()

const panel = ref([0]) // Expanded by default

const ingredientNames = computed(() => ingredientsStore.allIngredientNames)
const sourceBooks = computed(() => recipesStore.allSourceBooks)

const activeFilterCount = computed(() => {
  let count = 0
  if (filtersStore.searchText) count++
  if (filtersStore.ingredients.length > 0) count += filtersStore.ingredients.length
  if (filtersStore.sourceBooks.length > 0) count += filtersStore.sourceBooks.length
  if (filtersStore.categories.length > 0) count += filtersStore.categories.length
  if (filtersStore.tags.length > 0) count += filtersStore.tags.length
  if (filtersStore.maxPrepTime < 180) count++
  if (filtersStore.maxTotalTime < 300) count++
  if (filtersStore.seasonalThisMonth) count++
  return count
})
</script>
