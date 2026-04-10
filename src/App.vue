<template>
  <div class="min-h-screen bg-background text-on-background flex flex-col font-body selection:bg-primary/30 selection:text-primary">
    <TopNav />
    <div class="flex flex-1 overflow-hidden relative pt-16">
      <!-- Added a subtle ambient glow behind main content -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
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
