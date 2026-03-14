<template>
  <div>
    <v-row>
      <v-col v-for="recipe in recipes" :key="recipe.id" cols="12" sm="6" md="4" lg="3">
        <RecipeCard :recipe="recipe" />
      </v-col>
    </v-row>

    <v-row v-if="recipes.length === 0">
      <v-col>
        <v-alert type="info" variant="tonal">
          <div class="text-h6 mb-2">No recipes found</div>
          <div>Try adjusting your filters or search criteria.</div>
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '@/types/recipe'
import RecipeCard from './RecipeCard.vue'

defineProps<{
  recipes: Recipe[]
}>()
</script>
