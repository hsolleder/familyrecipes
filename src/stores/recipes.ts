import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Recipe } from '@/types/recipe'
import { useIngredientsStore } from './ingredients'
import { useSettingsStore } from './settings'
import { useSeasonality } from '@/composables/useSeasonality'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const ingredientsStore = useIngredientsStore()
  const settingsStore = useSettingsStore()
  const { calculateRecipeSeasonality } = useSeasonality()

  async function loadRecipes() {
    loading.value = true
    error.value = null

    try {
      const { parseYaml } = await import('@/utils/yaml')
      const modules = import.meta.glob('@/recipes/*.yml', {
        query: '?raw',
        import: 'default',
        eager: true
      })

      const loadedRecipes = Object.values(modules).map((content) =>
        parseYaml<Recipe>(content as string)
      )

      // Calculate seasonality for each recipe
      if (ingredientsStore.database) {
        recipes.value = loadedRecipes.map((recipe) => {
          const { seasonality, seasonalIngredients } = calculateRecipeSeasonality(
            recipe,
            ingredientsStore.database!,
            settingsStore.country
          )
          return {
            ...recipe,
            seasonality,
            seasonalIngredients
          }
        })
      } else {
        recipes.value = loadedRecipes
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load recipes'
      console.error('Error loading recipes:', e)
    } finally {
      loading.value = false
    }
  }

  // Watch for country changes and recalculate seasonality
  watch(
    () => settingsStore.country,
    (newCountry) => {
      if (ingredientsStore.database && recipes.value.length > 0) {
        recipes.value = recipes.value.map((recipe) => {
          const { seasonality, seasonalIngredients } = calculateRecipeSeasonality(
            recipe,
            ingredientsStore.database!,
            newCountry
          )
          return {
            ...recipe,
            seasonality,
            seasonalIngredients
          }
        })
      }
    }
  )

  const getRecipeById = computed(() => {
    return (id: string) => recipes.value.find((r) => r.id === id)
  })

  const allSourceBooks = computed(() => {
    const books = new Set<string>()
    recipes.value.forEach((recipe) => {
      if (recipe.source.type === 'book' && recipe.source.bookName) {
        books.add(recipe.source.bookName)
      }
    })
    return Array.from(books).sort()
  })

  return {
    recipes,
    loading,
    error,
    loadRecipes,
    getRecipeById,
    allSourceBooks
  }
})
