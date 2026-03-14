import { ref } from 'vue'
import type { IngredientDatabase } from '@/types/ingredient'
import { loadYamlFile } from '@/utils/yaml'

export function useIngredients() {
  const ingredients = ref<IngredientDatabase | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadIngredients() {
    loading.value = true
    error.value = null

    try {
      const data = await loadYamlFile<IngredientDatabase>(
        `${import.meta.env.BASE_URL}data/ingredients.yml`
      )
      ingredients.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load ingredients'
      console.error('Error loading ingredients:', e)
    } finally {
      loading.value = false
    }
  }

  function getAllIngredientNames(): string[] {
    if (!ingredients.value) return []

    const names: string[] = []
    for (const category of Object.values(ingredients.value)) {
      for (const ingredient of Object.values(category)) {
        names.push(ingredient.name)
      }
    }
    return names.sort()
  }

  return {
    ingredients,
    loading,
    error,
    loadIngredients,
    getAllIngredientNames
  }
}
