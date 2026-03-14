import { ref } from 'vue'
import type { Recipe } from '@/types/recipe'
import { loadYamlFile } from '@/utils/yaml'

export function useRecipes() {
  const recipes = ref<Recipe[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadRecipes() {
    loading.value = true
    error.value = null

    try {
      // In production, we'll need to load a manifest of recipe files
      // For now, we'll hardcode the list of recipe files
      const recipeFiles = [
        'pasta-carbonara-20260314.yml',
        'tomato-soup-20260314.yml',
        'chocolate-cake-20260314.yml',
        'greek-salad-20260314.yml',
        'roasted-vegetables-20260314.yml',
        'spicy-tuna-crispy-rice-20260314.yml'
      ]

      const loadedRecipes = await Promise.all(
        recipeFiles.map((file) =>
          loadYamlFile<Recipe>(`${import.meta.env.BASE_URL}recipes/${file}`)
        )
      )

      recipes.value = loadedRecipes
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load recipes'
      console.error('Error loading recipes:', e)
    } finally {
      loading.value = false
    }
  }

  function getRecipeById(id: string): Recipe | undefined {
    return recipes.value.find((r) => r.id === id)
  }

  return {
    recipes,
    loading,
    error,
    loadRecipes,
    getRecipeById
  }
}
