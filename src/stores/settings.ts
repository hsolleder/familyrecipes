import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Country } from '@/types/ingredient'

export const useSettingsStore = defineStore('settings', () => {
  const country = ref<Country>('switzerland')

  // Load from localStorage
  const loadSettings = () => {
    const saved = localStorage.getItem('familyrecipes-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        country.value = settings.country || 'switzerland'
      } catch (e) {
        console.error('Failed to parse settings from localStorage:', e)
      }
    }
  }

  // Save to localStorage on change
  watch(
    country,
    (newCountry) => {
      localStorage.setItem(
        'familyrecipes-settings',
        JSON.stringify({
          country: newCountry
        })
      )
    },
    { deep: true }
  )

  // Load settings on store initialization
  loadSettings()

  return {
    country
  }
})
