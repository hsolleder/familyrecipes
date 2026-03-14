import type { Recipe, MonthlyAvailability } from '@/types/recipe'
import type { IngredientDatabase, Ingredient } from '@/types/ingredient'
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
    ingredientDatabase: IngredientDatabase
  ): MonthlyAvailability {
    const seasonality: MonthlyAvailability = {} as MonthlyAvailability

    for (const month of MONTHS) {
      let totalScore = 0
      let ingredientCount = 0

      for (const ingredient of recipe.ingredients) {
        const dbIngredient = findIngredient(ingredient.name, ingredientDatabase)

        if (dbIngredient) {
          totalScore += dbIngredient.availability[month]
        } else {
          // Unknown ingredient: assume year-round availability
          totalScore += 100
        }

        ingredientCount++
      }

      // Calculate average availability for this month (0 or 100 for binary, or average)
      seasonality[month] = Math.round(totalScore / ingredientCount)
    }

    return seasonality
  }

  return {
    calculateRecipeSeasonality,
    findIngredient
  }
}
