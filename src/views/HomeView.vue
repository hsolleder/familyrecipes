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

    <v-row v-if="filtersStore.hasActiveFilters" class="mb-2">
      <v-col>
        <div class="d-flex flex-wrap align-center">
          <span class="text-caption mr-2">Active filters:</span>
          <v-chip
            v-for="ingredient in filtersStore.ingredients"
            :key="ingredient"
            closable
            size="small"
            class="mr-1 mb-1"
            @click:close="filtersStore.removeIngredient(ingredient)"
          >
            {{ ingredient }}
          </v-chip>
          <v-chip
            v-for="book in filtersStore.sourceBooks"
            :key="book"
            closable
            size="small"
            class="mr-1 mb-1"
            @click:close="filtersStore.removeSourceBook(book)"
          >
            {{ book }}
          </v-chip>
          <v-chip
            v-for="category in filtersStore.categories"
            :key="category"
            closable
            size="small"
            class="mr-1 mb-1"
            @click:close="filtersStore.removeCategory(category)"
          >
            {{ category }}
          </v-chip>
          <v-chip
            v-for="tag in filtersStore.tags"
            :key="tag"
            closable
            size="small"
            class="mr-1 mb-1"
            @click:close="filtersStore.removeTag(tag)"
          >
            {{ tag }}
          </v-chip>
          <v-btn size="small" variant="text" color="error" @click="filtersStore.resetFilters">
            Clear all
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="recipesStore.loading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>

    <v-row v-else-if="recipesStore.error">
      <v-col>
        <v-alert type="error">{{ recipesStore.error }}</v-alert>
      </v-col>
    </v-row>

    <RecipeList v-else :recipes="recipesStore.recipes" />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRecipesStore } from '@/stores/recipes'
import { useIngredientsStore } from '@/stores/ingredients'
import { useFiltersStore } from '@/stores/filters'
import RecipeList from '@/components/recipe/RecipeList.vue'

const recipesStore = useRecipesStore()
const ingredientsStore = useIngredientsStore()
const filtersStore = useFiltersStore()

onMounted(async () => {
  await ingredientsStore.loadIngredients()
  await recipesStore.loadRecipes()
})
</script>
