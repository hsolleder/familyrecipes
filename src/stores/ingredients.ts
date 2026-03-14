import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IngredientDatabase } from '@/types/ingredient'
import { loadYamlFile } from '@/utils/yaml'

export const useIngredientsStore = defineStore('ingredients', () => {
  const database = ref<IngredientDatabase | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadIngredients() {
    loading.value = true
    error.value = null

    try {
      const data = await loadYamlFile<IngredientDatabase>(
        `${import.meta.env.BASE_URL}data/ingredients.yml`
      )
      database.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load ingredients'
      console.error('Error loading ingredients:', e)
    } finally {
      loading.value = false
    }
  }

  const allIngredientNames = computed(() => {
    if (!database.value) return []

    const names: string[] = []
    for (const category of Object.values(database.value)) {
      for (const ingredient of Object.values(category)) {
        names.push(ingredient.name)
      }
    }
    return names.sort()
  })

  return {
    database,
    loading,
    error,
    loadIngredients,
    allIngredientNames
  }
})
