<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-title>
      <router-link to="/" class="text-decoration-none text-white"> Family Recipes </router-link>
    </v-app-bar-title>

    <v-spacer />

    <v-btn icon="mdi-plus" :to="{ name: 'add-recipe' }" variant="text" />
  </v-app-bar>
</template>

<script setup lang="ts"></script>

<style scoped>
a {
  color: inherit;
}
</style>
