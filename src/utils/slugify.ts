export function generateRecipeId(name: string): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${slug}-${date}`
}
