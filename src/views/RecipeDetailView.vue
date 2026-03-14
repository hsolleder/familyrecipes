<template>
  <v-container v-if="recipe">
    <v-row>
      <v-col>
        <v-btn :to="{ name: 'home' }" variant="text" prepend-icon="mdi-arrow-left">
          Back to Recipes
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h4">{{ recipe.name }}</v-card-title>

          <v-card-subtitle>
            <v-chip v-for="category in recipe.categories" :key="category" class="mr-1 mb-1">
              {{ category }}
            </v-chip>
            <v-chip v-for="tag in recipe.tags" :key="tag" variant="outlined" class="mr-1 mb-1">
              {{ tag }}
            </v-chip>
          </v-card-subtitle>

          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon>{{
                    recipe.source.type === 'book' ? 'mdi-book-open-variant' : 'mdi-link'
                  }}</v-icon>
                </template>
                <v-list-item-title>Source</v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="recipe.source.type === 'book'">
                    {{ recipe.source.bookName }}
                    <span v-if="recipe.source.pages">, pages {{ recipe.source.pages }}</span>
                  </span>
                  <a v-else :href="recipe.source.url" target="_blank" rel="noopener">
                    {{ recipe.source.url }}
                  </a>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-account-group-outline</v-icon>
                </template>
                <v-list-item-title>Portions</v-list-item-title>
                <v-list-item-subtitle>{{ recipe.portions }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-clock-outline</v-icon>
                </template>
                <v-list-item-title>Times</v-list-item-title>
                <v-list-item-subtitle>
                  <div>Preparation: {{ formatTime(recipe.times.preparation) }}</div>
                  <div v-if="recipe.times.resting">
                    Resting: {{ formatTime(recipe.times.resting) }}
                  </div>
                  <div>Cooking: {{ formatTime(recipe.times.cooking) }}</div>
                  <div class="font-weight-bold mt-1">Total: {{ formatTime(totalTime) }}</div>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider class="my-4" />

            <div class="text-h6 mb-2">Ingredients</div>
            <v-list>
              <v-list-item v-for="(ingredient, index) in recipe.ingredients" :key="index" dense>
                <template #prepend>
                  <v-icon size="small">mdi-circle-small</v-icon>
                </template>
                <v-list-item-title>
                  <span v-if="ingredient.amount">{{ ingredient.amount }}</span>
                  <span v-if="ingredient.unit"> {{ ingredient.unit }}</span>
                  {{ ingredient.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider v-if="recipe.notes" class="my-4" />

            <div v-if="recipe.notes">
              <div class="text-h6 mb-2">Notes</div>
              <div class="text-body-2" style="white-space: pre-line">{{ recipe.notes }}</div>
            </div>

            <v-divider class="my-4" />

            <div class="text-caption text-grey">
              Added: {{ formatDate(recipe.dateAdded) }}
              <span v-if="recipe.dateAdded !== recipe.dateModified">
                • Modified: {{ formatDate(recipe.dateModified) }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card v-if="recipe.seasonality">
          <MonthlyChart :seasonality="recipe.seasonality" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else>
    <v-row>
      <v-col>
        <v-alert type="error">Recipe not found</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes'
import { useIngredientsStore } from '@/stores/ingredients'
import { formatTime, getTotalTime } from '@/utils/time'
import MonthlyChart from '@/components/seasonality/MonthlyChart.vue'

const route = useRoute()
const recipesStore = useRecipesStore()
const ingredientsStore = useIngredientsStore()

const recipe = computed(() => recipesStore.getRecipeById(route.params.id as string))
const totalTime = computed(() => (recipe.value ? getTotalTime(recipe.value.times) : 0))

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  if (recipesStore.recipes.length === 0) {
    await ingredientsStore.loadIngredients()
    await recipesStore.loadRecipes()
  }
})
</script>
