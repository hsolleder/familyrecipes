export type Country = 'switzerland'

export interface Ingredient {
  name: string
  availability?: Record<Country, number[]>
  category: string
}

export interface IngredientDatabase {
  vegetables: Record<string, Ingredient>
  fruits: Record<string, Ingredient>
  proteins: Record<string, Ingredient>
  dairy: Record<string, Ingredient>
  grains: Record<string, Ingredient>
  herbs: Record<string, Ingredient>
  baking: Record<string, Ingredient>
  oils: Record<string, Ingredient>
}
