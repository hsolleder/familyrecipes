<template>
  <v-card :to="{ name: 'recipe-detail', params: { id: recipe.id } }" hover class="recipe-card">
    <v-card-title>{{ recipe.name }}</v-card-title>

    <v-card-subtitle>
      <v-chip v-for="category in recipe.categories" :key="category" size="small" class="mr-1 mb-1">
        {{ category }}
      </v-chip>
      <v-chip
        v-for="tag in recipe.tags"
        :key="tag"
        size="small"
        variant="outlined"
        class="mr-1 mb-1"
      >
        {{ tag }}
      </v-chip>
    </v-card-subtitle>

    <v-card-text>
      <div class="mb-2">
        <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
        {{ formatTime(totalTime) }} total
      </div>

      <div class="mb-2">
        <v-icon size="small" class="mr-1">mdi-account-group-outline</v-icon>
        {{ recipe.portions }} {{ recipe.portions === 1 ? 'portion' : 'portions' }}
      </div>

      <div v-if="recipe.seasonality" class="mb-2">
        <SeasonBadge :seasonality="recipe.seasonality" />
      </div>

      <div class="text-caption">
        <v-icon size="small" class="mr-1">{{
          recipe.source.type === 'book' ? 'mdi-book-open-variant' : 'mdi-link'
        }}</v-icon>
        <span v-if="recipe.source.type === 'book'">
          {{ recipe.source.bookName }}
          <span v-if="recipe.source.pages"> p.{{ recipe.source.pages }}</span>
        </span>
        <span v-else>Link</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Recipe } from '@/types/recipe'
import { formatTime, getTotalTime } from '@/utils/time'
import SeasonBadge from '@/components/seasonality/SeasonBadge.vue'

const props = defineProps<{
  recipe: Recipe
}>()

const totalTime = computed(() => getTotalTime(props.recipe.times))
</script>

<style scoped>
.recipe-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
