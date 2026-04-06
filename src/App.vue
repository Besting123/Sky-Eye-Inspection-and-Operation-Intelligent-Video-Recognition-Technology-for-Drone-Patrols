<template>
  <TopNav />
  <div class="flex flex-1 pt-16 overflow-hidden relative">
    <router-view></router-view>
  </div>
</template>

<script setup>
import TopNav from './components/TopNav.vue'
</script>
