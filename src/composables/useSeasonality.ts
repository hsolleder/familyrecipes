import type { Recipe, MonthlyAvailability } from '@/types/recipe'
import type { IngredientDatabase, Ingredient, Country } from '@/types/ingredient'
import { MONTHS } from '@/utils/constants'

export function useSeasonality() {
  function findIngredient(name: string, database: IngredientDatabase): Ingredient | null {
    const normalizedName = name.toLowerCase().trim()

    // Search all categories
    for (const category of Object.values(database)) {
      for (const [key, ingredient] of Object.entries(category)) {
        const typedIngredient = ingredient as Ingredient
        if (
          key.toLowerCase() === normalizedName ||
          typedIngredient.name.toLowerCase() === normalizedName
        ) {
          return typedIngredient
        }
      }
    }
    return null
  }

  function calculateRecipeSeasonality(
    recipe: Recipe,
    ingredientDatabase: IngredientDatabase,
    country: Country = 'switzerland'
  ): {
    seasonality: MonthlyAvailability | null
    seasonalIngredients: string[]
  } {
    const seasonalIngredients: string[] = []

    // Only process vegetables and fruits
    const relevantIngredients = recipe.ingredients.filter((recipeIng) => {
      const ingredient = findIngredient(recipeIng.name, ingredientDatabase)
      if (!ingredient) return false

      const isVeggieOrFruit = ingredient.category === 'vegetable' || ingredient.category === 'fruit'
      const hasAvailability = ingredient.availability?.[country]

      if (isVeggieOrFruit && hasAvailability) {
        seasonalIngredients.push(ingredient.name)
        return true
      }
      return false
    })

    // If no vegetables/fruits, return null (not seasonal)
    if (relevantIngredients.length === 0) {
      return { seasonality: null, seasonalIngredients: [] }
    }

    // Calculate seasonality for each month
    const seasonality: MonthlyAvailability = {} as MonthlyAvailability

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthName = MONTHS[monthIndex]
      const monthNumber = monthIndex + 1 // 1-based month number
      let inSeasonCount = 0

      for (const recipeIng of relevantIngredients) {
        const ingredient = findIngredient(recipeIng.name, ingredientDatabase)
        const availability = ingredient?.availability?.[country]

        if (availability && availability.includes(monthNumber)) {
          inSeasonCount++
        }
      }

      // Score = percentage of ingredients in season (0-100)
      const score = (inSeasonCount / relevantIngredients.length) * 100
      seasonality[monthName] = Math.round(score)
    }

    return { seasonality, seasonalIngredients }
  }

  return {
    calculateRecipeSeasonality,
    findIngredient
  }
}
