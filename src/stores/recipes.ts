import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Recipe } from '@/types/recipe'
import { useIngredientsStore } from './ingredients'
import { useSeasonality } from '@/composables/useSeasonality'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const ingredientsStore = useIngredientsStore()
  const { calculateRecipeSeasonality } = useSeasonality()

  async function loadRecipes() {
    loading.value = true
    error.value = null

    try {
      const recipeFiles = [
        'pasta-carbonara-20260314.yml',
        'tomato-soup-20260314.yml',
        'chocolate-cake-20260314.yml',
        'greek-salad-20260314.yml',
        'roasted-vegetables-20260314.yml'
      ]

      const { loadYamlFile } = await import('@/utils/yaml')
      const loadedRecipes = await Promise.all(
        recipeFiles.map((file) =>
          loadYamlFile<Recipe>(`${import.meta.env.BASE_URL}recipes/${file}`)
        )
      )

      // Calculate seasonality for each recipe
      if (ingredientsStore.database) {
        recipes.value = loadedRecipes.map((recipe) => ({
          ...recipe,
          seasonality: calculateRecipeSeasonality(recipe, ingredientsStore.database!)
        }))
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
