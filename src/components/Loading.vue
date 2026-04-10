<template>
  <teleport to="body">
    <transition name="loading">
      <div v-if="isLoading" class="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-large p-8 shadow-apple min-w-[320px]">
          <div class="flex flex-col items-center gap-4">
            <div class="relative w-16 h-16">
              <div class="absolute inset-0 border-4 border-text-primary/10 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-transparent border-t-apple-blue rounded-full animate-spin"></div>
            </div>
            <div v-if="message" class="text-center">
              <div class="text-body font-semibold text-text-primary mb-1">{{ message }}</div>
              <div v-if="progress !== null" class="text-caption text-text-tertiary">{{ progress }}%</div>
            </div>
          </div>
          <div v-if="progress !== null" class="mt-4 w-full h-1 bg-light-gray rounded-full overflow-hidden">
            <div 
              class="h-full bg-apple-blue transition-all duration-300 ease-out"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(false)
const message = ref('')
const progress = ref(null)

function show(msg = '加载中...', showProgress = false) {
  isLoading.value = true
  message.value = msg
  progress.value = showProgress ? 0 : null
}

function hide() {
  isLoading.value = false
  message.value = ''
  progress.value = null
}

function updateProgress(value) {
  progress.value = Math.min(100, Math.max(0, value))
}

function updateMessage(msg) {
  message.value = msg
}

defineExpose({
  show,
  hide,
  updateProgress,
  updateMessage
})
</script>

<style scoped>
.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.2s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
