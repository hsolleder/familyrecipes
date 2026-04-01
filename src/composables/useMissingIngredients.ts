import { computed, type Ref } from 'vue'
import type { RecipeIngredient } from '@/types/recipe'

export type IngredientCategory =
  | 'vegetables'
  | 'fruits'
  | 'proteins'
  | 'dairy'
  | 'grains'
  | 'herbs'
  | 'baking'
  | 'oils'
  | 'other'

export interface NewIngredient {
  name: string
  category: IngredientCategory
  seasonal: boolean
  availability?: number[] // Month numbers 1-12
}

export function useMissingIngredients(
  recipeIngredients: Ref<RecipeIngredient[]>,
  existingIngredients: Ref<string[]>
) {
  const missing = computed(() => {
    return recipeIngredients.value
      .map((ing) => ing.name.toLowerCase().trim())
      .filter(
        (name) =>
          name && !existingIngredients.value.some((existing) => existing.toLowerCase() === name)
      )
  })

  function guessCategory(ingredientName: string): IngredientCategory {
    const name = ingredientName.toLowerCase()

    // Vegetables
    if (
      /(tomato|zucchini|cucumber|pepper|eggplant|lettuce|carrot|onion|garlic|potato|broccoli|cauliflower|spinach|kale|cabbage|celery|radish|beet|turnip|squash|pumpkin|mushroom)/i.test(
        name
      )
    ) {
      return 'vegetables'
    }

    // Fruits
    if (
      /(apple|pear|strawberry|cherry|plum|raspberry|blueberry|apricot|grape|orange|lemon|lime|banana|mango|pineapple|melon|peach|kiwi|berry)/i.test(
        name
      )
    ) {
      return 'fruits'
    }

    // Proteins
    if (
      /(chicken|beef|pork|lamb|turkey|fish|salmon|tuna|shrimp|egg|tofu|tempeh|seitan)/i.test(name)
    ) {
      return 'proteins'
    }

    // Dairy
    if (
      /(milk|cream|cheese|butter|yogurt|cheddar|mozzarella|parmesan|ricotta|goat cheese|feta)/i.test(
        name
      )
    ) {
      return 'dairy'
    }

    // Grains
    if (
      /(rice|pasta|bread|flour|oat|quinoa|couscous|barley|wheat|noodle|spaghetti|penne)/i.test(name)
    ) {
      return 'grains'
    }

    // Herbs
    if (/(basil|parsley|cilantro|thyme|rosemary|oregano|mint|sage|dill|chive)/i.test(name)) {
      return 'herbs'
    }

    // Baking
    if (/(sugar|yeast|baking powder|baking soda|vanilla|cocoa|chocolate)/i.test(name)) {
      return 'baking'
    }

    // Oils
    if (/(oil|olive oil|vegetable oil|coconut oil|vinegar|sesame oil)/i.test(name)) {
      return 'oils'
    }

    // Default
    return 'other'
  }

  function shouldHaveSeasonality(category: IngredientCategory): boolean {
    return category === 'vegetables' || category === 'fruits'
  }

  return {
    missing,
    guessCategory,
    shouldHaveSeasonality
  }
}
