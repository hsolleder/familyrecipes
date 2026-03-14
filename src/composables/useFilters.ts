import type { Recipe } from '@/types/recipe'
import type { FilterState } from '@/types/filter'
import { getTotalTime } from '@/utils/time'
import { getCurrentMonth } from '@/utils/constants'

export function useFilters() {
  function filterRecipes(recipes: Recipe[], filters: FilterState): Recipe[] {
    return recipes.filter((recipe) => {
      // Text search (name, ingredients, notes, source book)
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase()
        const matchesSearch =
          recipe.name.toLowerCase().includes(searchLower) ||
          recipe.ingredients.some((i) => i.name.toLowerCase().includes(searchLower)) ||
          recipe.notes?.toLowerCase().includes(searchLower) ||
          recipe.source.bookName?.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Ingredient filter (recipe must have ALL selected ingredients)
      if (filters.ingredients.length > 0) {
        const recipeIngredients = recipe.ingredients.map((i) => i.name.toLowerCase())
        const hasAllIngredients = filters.ingredients.every((filterIng) =>
          recipeIngredients.some((recipeIng) => recipeIng.includes(filterIng.toLowerCase()))
        )
        if (!hasAllIngredients) return false
      }

      // Source book filter (OR logic)
      if (filters.sourceBooks.length > 0) {
        if (!recipe.source.bookName) return false
        if (!filters.sourceBooks.includes(recipe.source.bookName)) {
          return false
        }
      }

      // Category filter (OR logic - match any)
      if (filters.categories.length > 0) {
        const hasCategory = filters.categories.some((cat) => recipe.categories.includes(cat))
        if (!hasCategory) return false
      }

      // Tag filter (OR logic - match any)
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) => recipe.tags.includes(tag))
        if (!hasTag) return false
      }

      // Prep time filter
      if (filters.maxPrepTime < 180) {
        if (recipe.times.preparation > filters.maxPrepTime) {
          return false
        }
      }

      // Total time filter
      const totalTime = getTotalTime(recipe.times)
      if (filters.maxTotalTime < 300) {
        if (totalTime > filters.maxTotalTime) {
          return false
        }
      }

      // Seasonal filter (show only if >= 70% seasonal this month)
      if (filters.seasonalThisMonth && recipe.seasonality) {
        const currentMonth = getCurrentMonth()
        const score = recipe.seasonality[currentMonth as keyof typeof recipe.seasonality] || 100
        if (score < 70) return false
      }

      return true
    })
  }

  function sortRecipes(recipes: Recipe[], sortBy: string): Recipe[] {
    const sorted = [...recipes]

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'date-newest':
        return sorted.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
      case 'date-oldest':
        return sorted.sort((a, b) => a.dateAdded.localeCompare(b.dateAdded))
      case 'time-shortest':
        return sorted.sort((a, b) => getTotalTime(a.times) - getTotalTime(b.times))
      case 'time-longest':
        return sorted.sort((a, b) => getTotalTime(b.times) - getTotalTime(a.times))
      case 'seasonal-best':
      case 'seasonal-worst': {
        const currentMonth = getCurrentMonth()
        return sorted.sort((a, b) => {
          const scoreA = a.seasonality?.[currentMonth as keyof typeof a.seasonality] || 100
          const scoreB = b.seasonality?.[currentMonth as keyof typeof b.seasonality] || 100
          return sortBy === 'seasonal-best' ? scoreB - scoreA : scoreA - scoreB
        })
      }
      default:
        return sorted
    }
  }

  return {
    filterRecipes,
    sortRecipes
  }
}
