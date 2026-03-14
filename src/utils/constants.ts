import type { Category, Tag } from '@/types/recipe'

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

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export function getCurrentMonth(): string {
  const now = new Date()
  return MONTHS[now.getMonth()]
}

export function getMonthIndex(month: string): number {
  return MONTHS.indexOf(month as any)
}
