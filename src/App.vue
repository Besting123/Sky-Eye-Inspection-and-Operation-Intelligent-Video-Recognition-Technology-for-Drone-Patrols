<template>
  <div class="min-h-screen bg-light-gray text-text-primary flex flex-col font-body selection:bg-apple-blue/30 selection:text-white antialiased">
    <TopNav />
    <div class="flex flex-1 overflow-hidden relative pt-12">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <Toast ref="toastRef" />
  </div>
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
