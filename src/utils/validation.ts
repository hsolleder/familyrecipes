import type { Recipe } from '@/types/recipe'

export function validateRecipe(recipe: Partial<Recipe>): string[] {
  const errors: string[] = []

  if (!recipe.name || recipe.name.trim() === '') {
    errors.push('Recipe name is required')
  }

  if (!recipe.portions || recipe.portions < 1) {
    errors.push('Portions must be at least 1')
  }

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.push('At least one ingredient is required')
  }

  if (!recipe.categories || recipe.categories.length === 0) {
    errors.push('At least one category is required')
  }

  if (!recipe.times) {
    errors.push('Times are required')
  } else {
    if (recipe.times.preparation < 0) {
      errors.push('Preparation time must be positive')
    }
    if (recipe.times.cooking < 0) {
      errors.push('Cooking time must be positive')
    }
    if (recipe.times.resting && recipe.times.resting < 0) {
      errors.push('Resting time must be positive')
    }
  }

  if (!recipe.source) {
    errors.push('Source is required')
  } else {
    if (recipe.source.type === 'link' && !recipe.source.url) {
      errors.push('URL is required for link source type')
    }
    if (recipe.source.type === 'book' && !recipe.source.bookName) {
      errors.push('Book name is required for book source type')
    }
  }

  return errors
}
