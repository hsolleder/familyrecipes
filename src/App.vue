<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBar from '@/components/layout/AppBar.vue'
import { useGitHub } from '@/composables/useGitHub'

const route = useRoute()
const router = useRouter()
const github = useGitHub()

// Handle OAuth callback
onMounted(() => {
  const token = route.query.github_token as string
  if (token) {
    github.saveToken(token)
    // Remove token from URL
    router.replace({ query: {} })
  }
})
</script>
