export interface Recipe {
  id: string
  name: string
  source: RecipeSource
  ingredients: RecipeIngredient[]
  portions: number
  times: RecipeTimes
  categories: Category[]
  tags: Tag[]
  notes?: string
  dateAdded: string
  dateModified: string
  seasonality?: MonthlyAvailability
}

export interface RecipeSource {
  type: 'link' | 'book'
  url?: string
  bookName?: string
  pages?: string
}

export interface RecipeIngredient {
  name: string
  amount?: string
  unit?: string
}

export interface RecipeTimes {
  preparation: number
  resting?: number
  cooking: number
}

export type Category = 'entry' | 'main' | 'dessert' | 'side' | 'snack' | 'drink' | 'breakfast'

export type Tag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'quick'
  | 'advanced'
  | 'italian'
  | 'french'
  | 'asian'
  | 'mediterranean'

export interface MonthlyAvailability {
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

export const CATEGORIES: Category[] = [
  'entry',
  'main',
  'dessert',
  'side',
  'snack',
  'drink',
  'breakfast'
]

export const TAGS: Tag[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'quick',
  'advanced',
  'italian',
  'french',
  'asian',
  'mediterranean'
]

export const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
] as const

export type Month = (typeof MONTHS)[number]
