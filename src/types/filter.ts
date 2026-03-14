import type { Category, Tag } from './recipe'

export interface FilterState {
  searchText: string
  ingredients: string[]
  sourceBooks: string[]
  categories: Category[]
  tags: Tag[]
  maxPrepTime: number
  maxTotalTime: number
  seasonalThisMonth: boolean
}

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'date-newest'
  | 'date-oldest'
  | 'time-shortest'
  | 'time-longest'
  | 'seasonal-best'
  | 'seasonal-worst'
