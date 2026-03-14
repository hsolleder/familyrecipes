import type { RecipeTimes } from '@/types/recipe'

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) {
    return `${hours}h`
  }

  return `${hours}h ${mins}min`
}

export function formatTimeBreakdown(times: RecipeTimes): string {
  const parts: string[] = []

  if (times.preparation > 0) {
    parts.push(`${formatTime(times.preparation)} prep`)
  }

  if (times.resting && times.resting > 0) {
    parts.push(`${formatTime(times.resting)} rest`)
  }

  if (times.cooking > 0) {
    parts.push(`${formatTime(times.cooking)} cook`)
  }

  return parts.join(', ')
}

export function getTotalTime(times: RecipeTimes): number {
  return times.preparation + (times.resting || 0) + times.cooking
}
