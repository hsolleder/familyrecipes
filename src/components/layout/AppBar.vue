<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-title>
      <router-link to="/" class="text-decoration-none text-white"> Family Recipes </router-link>
    </v-app-bar-title>

    <v-spacer />

    <v-btn icon="mdi-plus" :to="{ name: 'add-recipe' }" variant="text" />

    <!-- GitHub Connection Status -->
    <v-menu v-if="github.isAuthenticated()">
      <template #activator="{ props }">
        <v-btn icon="mdi-github" variant="text" v-bind="props" />
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>GitHub Connected</v-list-item-title>
          <v-list-item-subtitle>You can create pull requests</v-list-item-subtitle>
        </v-list-item>
        <v-list-item @click="handleSignOut">
          <v-list-item-title>Sign Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useGitHub } from '@/composables/useGitHub'

const github = useGitHub()

function handleSignOut() {
  if (confirm('Are you sure you want to disconnect from GitHub? You can reconnect anytime.')) {
    github.clearToken()
  }
}
</script>

<style scoped>
a {
  color: inherit;
}
</style>
