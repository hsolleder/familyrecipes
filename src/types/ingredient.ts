export interface Ingredient {
  name: string
  availability: {
    january: number
    february: number
    march: number
    april: number
    may: number
    june: number
    july: number
    august: number
    september: number
    october: number
    november: number
    december: number
  }
  category: string
}

export interface IngredientDatabase {
  vegetables: Record<string, Ingredient>
  proteins: Record<string, Ingredient>
  dairy: Record<string, Ingredient>
  grains: Record<string, Ingredient>
  herbs: Record<string, Ingredient>
  baking: Record<string, Ingredient>
  oils: Record<string, Ingredient>
}
