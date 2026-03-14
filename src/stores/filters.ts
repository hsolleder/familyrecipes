import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FilterState, SortOption } from '@/types/filter'
import type { Category, Tag } from '@/types/recipe'

export const useFiltersStore = defineStore('filters', () => {
  const searchText = ref('')
  const ingredients = ref<string[]>([])
  const sourceBooks = ref<string[]>([])
  const categories = ref<Category[]>([])
  const tags = ref<Tag[]>([])
  const maxPrepTime = ref(180)
  const maxTotalTime = ref(300)
  const seasonalThisMonth = ref(false)
  const sortBy = ref<SortOption>('name-asc')

  const filterState = computed<FilterState>(() => ({
    searchText: searchText.value,
    ingredients: ingredients.value,
    sourceBooks: sourceBooks.value,
    categories: categories.value,
    tags: tags.value,
    maxPrepTime: maxPrepTime.value,
    maxTotalTime: maxTotalTime.value,
    seasonalThisMonth: seasonalThisMonth.value
  }))

  const hasActiveFilters = computed(() => {
    return (
      searchText.value !== '' ||
      ingredients.value.length > 0 ||
      sourceBooks.value.length > 0 ||
      categories.value.length > 0 ||
      tags.value.length > 0 ||
      maxPrepTime.value < 180 ||
      maxTotalTime.value < 300 ||
      seasonalThisMonth.value
    )
  })

  function resetFilters() {
    searchText.value = ''
    ingredients.value = []
    sourceBooks.value = []
    categories.value = []
    tags.value = []
    maxPrepTime.value = 180
    maxTotalTime.value = 300
    seasonalThisMonth.value = false
  }

  function removeIngredient(ingredient: string) {
    ingredients.value = ingredients.value.filter((i) => i !== ingredient)
  }

  function removeSourceBook(book: string) {
    sourceBooks.value = sourceBooks.value.filter((b) => b !== book)
  }

  function removeCategory(category: Category) {
    categories.value = categories.value.filter((c) => c !== category)
  }

  function removeTag(tag: Tag) {
    tags.value = tags.value.filter((t) => t !== tag)
  }

  return {
    searchText,
    ingredients,
    sourceBooks,
    categories,
    tags,
    maxPrepTime,
    maxTotalTime,
    seasonalThisMonth,
    sortBy,
    filterState,
    hasActiveFilters,
    resetFilters,
    removeIngredient,
    removeSourceBook,
    removeCategory,
    removeTag
  }
})
