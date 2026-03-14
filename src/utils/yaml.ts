import yaml from 'js-yaml'

export async function loadYamlFile<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.statusText}`)
  }
  const text = await response.text()
  return yaml.load(text) as T
}

export function stringifyYaml(data: any): string {
  return yaml.dump(data, {
    indent: 2,
    lineWidth: -1,
    noRefs: true
  })
}
