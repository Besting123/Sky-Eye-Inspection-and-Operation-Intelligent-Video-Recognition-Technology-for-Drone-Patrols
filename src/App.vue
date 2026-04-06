<template>
  <TopNav />
  <div class="flex flex-1 overflow-hidden relative pt-16">
    <router-view></router-view>
  </div>
  <Toast ref="toastRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNav from './components/TopNav.vue'
import Toast from './components/Toast.vue'
import wsClient from './services/websocket'

const toastRef = ref(null)

onMounted(async () => {
  try {
    await wsClient.connect()
  } catch (e) {
    console.error('WebSocket connection failed:', e)
  }
})
</script>
