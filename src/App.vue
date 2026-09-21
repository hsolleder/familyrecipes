<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBar from '@/components/layout/AppBar.vue'
import { useGitHub } from '@/composables/useGitHub'
import { ADD_RECIPE_DRAFT_KEY } from '@/utils/constants'

const route = useRoute()
const router = useRouter()
const github = useGitHub()

// Handle OAuth callback
watch(
  () => route.query,
  (query) => {
    const token = query.github_token as string | undefined
    if (token) {
      github.saveToken(token)
      const refresh = query.github_refresh as string | undefined
      const expiresIn = Number(query.github_expires)
      if (refresh) github.saveRefreshToken(refresh)
      if (Number.isFinite(expiresIn) && expiresIn > 0) {
        github.saveTokenExpiry(Date.now() + expiresIn * 1000)
      }
      const hasDraft = !!sessionStorage.getItem(ADD_RECIPE_DRAFT_KEY)
      if (hasDraft) {
        router.replace({ path: '/add', query: {} })
      } else {
        router.replace({ query: {} })
      }
    }
  },
  { immediate: true }
)
</script>
