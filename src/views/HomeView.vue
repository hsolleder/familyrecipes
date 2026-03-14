<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="filtersStore.searchText"
          label="Search recipes..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
          class="mb-4"
        />
      </v-col>
    </v-row>

    <!-- Filter Panel -->
    <v-row>
      <v-col cols="12">
        <FilterPanel />
      </v-col>
    </v-row>

    <!-- Active Filters Chips -->
    <v-row v-if="filtersStore.hasActiveFilters" class="mb-2">
      <v-col>
        <div class="d-flex flex-wrap align-center">
          <span class="text-caption mr-2">Active filters:</span>
          <v-chip
            v-for="ingredient in filtersStore.ingredients"
            :key="`ing-${ingredient}`"
            closable
            size="small"
            class="mr-1 mb-1"
            @click:close="filtersStore.removeIngredient(ingredient)"
          >
            <v-icon start size="small">mdi-food-apple</v-icon>
            {{ ingredient }}
          </v-chip>
          <v-chip
            v-for="book in filtersStore.sourceBooks"
            :key="`book-${book}`"
            closable
            size="small"
            class="mr-1 mb-1"
            @click:close="filtersStore.removeSourceBook(book)"
          >
            <v-icon start size="small">mdi-book-open-variant</v-icon>
            {{ book }}
          </v-chip>
          <v-chip
            v-for="category in filtersStore.categories"
            :key="`cat-${category}`"
            closable
            size="small"
            class="mr-1 mb-1"
            @click:close="filtersStore.removeCategory(category)"
          >
            <v-icon start size="small">mdi-tag</v-icon>
            {{ category }}
          </v-chip>
          <v-chip
            v-for="tag in filtersStore.tags"
            :key="`tag-${tag}`"
            closable
            size="small"
            class="mr-1 mb-1"
            @click:close="filtersStore.removeTag(tag)"
          >
            <v-icon start size="small">mdi-tag-outline</v-icon>
            {{ tag }}
          </v-chip>
          <v-chip
            v-if="filtersStore.seasonalThisMonth"
            closable
            size="small"
            color="success"
            class="mr-1 mb-1"
            @click:close="filtersStore.seasonalThisMonth = false"
          >
            <v-icon start size="small">mdi-leaf</v-icon>
            Seasonal this month
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- Sort and View Options -->
    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          v-model="filtersStore.sortBy"
          :items="sortOptions"
          label="Sort by"
          variant="outlined"
          density="compact"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6" class="text-right">
        <div class="text-caption text-grey">
          Showing {{ filteredAndSortedRecipes.length }} of {{ recipesStore.recipes.length }}
          {{ recipesStore.recipes.length === 1 ? 'recipe' : 'recipes' }}
        </div>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="recipesStore.loading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary" />
        <div class="mt-2">Loading recipes...</div>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="recipesStore.error">
      <v-col>
        <v-alert type="error">{{ recipesStore.error }}</v-alert>
      </v-col>
    </v-row>

    <!-- Recipe List -->
    <RecipeList v-else :recipes="filteredAndSortedRecipes" />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRecipesStore } from '@/stores/recipes'
import { useIngredientsStore } from '@/stores/ingredients'
import { useFiltersStore } from '@/stores/filters'
import { useFilters } from '@/composables/useFilters'
import RecipeList from '@/components/recipe/RecipeList.vue'
import FilterPanel from '@/components/filters/FilterPanel.vue'

const recipesStore = useRecipesStore()
const ingredientsStore = useIngredientsStore()
const filtersStore = useFiltersStore()
const { filterRecipes, sortRecipes } = useFilters()

const sortOptions = [
  { title: 'Name (A-Z)', value: 'name-asc' },
  { title: 'Name (Z-A)', value: 'name-desc' },
  { title: 'Date Added (Newest)', value: 'date-newest' },
  { title: 'Date Added (Oldest)', value: 'date-oldest' },
  { title: 'Total Time (Shortest)', value: 'time-shortest' },
  { title: 'Total Time (Longest)', value: 'time-longest' },
  { title: 'Seasonality (Best Now)', value: 'seasonal-best' },
  { title: 'Seasonality (Worst Now)', value: 'seasonal-worst' }
]

const filteredAndSortedRecipes = computed(() => {
  const filtered = filterRecipes(recipesStore.recipes, filtersStore.filterState)
  return sortRecipes(filtered, filtersStore.sortBy)
})

onMounted(async () => {
  await ingredientsStore.loadIngredients()
  await recipesStore.loadRecipes()
})
</script>
