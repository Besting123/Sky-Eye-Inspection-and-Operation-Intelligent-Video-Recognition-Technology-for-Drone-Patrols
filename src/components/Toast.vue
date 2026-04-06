<template>
  <teleport to="body">
    <transition-group name="toast" tag="div" class="fixed top-20 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto bg-surface-container-high border rounded-lg shadow-2xl overflow-hidden min-w-[320px] max-w-[420px]"
        :class="getToastClass(toast.type)"
      >
        <div class="flex items-start gap-3 p-4">
          <span class="material-symbols-outlined text-xl flex-shrink-0" :class="getIconClass(toast.type)">
            {{ getIcon(toast.type) }}
          </span>
          <div class="flex-1 min-w-0">
            <div v-if="toast.title" class="font-bold text-sm mb-1" :class="getTextClass(toast.type)">
              {{ toast.title }}
            </div>
            <div class="text-sm text-on-surface-variant break-words">
              {{ toast.message }}
            </div>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div
          v-if="toast.duration"
          class="h-1 transition-all duration-100 ease-linear"
          :class="getProgressClass(toast.type)"
          :style="{ width: `${toast.progress}%` }"
        ></div>
      </div>
    </transition-group>
  </teleport>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const toasts = ref([])
let toastId = 0
const timers = new Map()

function addToast({ type = 'info', title = '', message, duration = 5000 }) {
  const id = ++toastId
  const toast = {
    id,
    type,
    title,
    message,
    duration,
    progress: 100
  }

  toasts.value.push(toast)

  if (duration > 0) {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      toast.progress = Math.max(0, 100 - (elapsed / duration) * 100)

      if (elapsed >= duration) {
        clearInterval(interval)
        removeToast(id)
      }
    }, 50)

    timers.set(id, interval)
  }

  return id
}

function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }

  const timer = timers.get(id)
  if (timer) {
    clearInterval(timer)
    timers.delete(id)
  }
}

function getToastClass(type) {
  const classes = {
    success: 'border-tertiary/30',
    error: 'border-error/30',
    warning: 'border-[#f59e0b]/30',
    info: 'border-primary/30'
  }
  return classes[type] || classes.info
}

function getIconClass(type) {
  const classes = {
    success: 'text-tertiary',
    error: 'text-error',
    warning: 'text-[#f59e0b]',
    info: 'text-primary'
  }
  return classes[type] || classes.info
}

function getTextClass(type) {
  const classes = {
    success: 'text-tertiary',
    error: 'text-error',
    warning: 'text-[#f59e0b]',
    info: 'text-primary'
  }
  return classes[type] || classes.info
}

function getProgressClass(type) {
  const classes = {
    success: 'bg-tertiary',
    error: 'bg-error',
    warning: 'bg-[#f59e0b]',
    info: 'bg-primary'
  }
  return classes[type] || classes.info
}

function getIcon(type) {
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return icons[type] || icons.info
}

onUnmounted(() => {
  timers.forEach(timer => clearInterval(timer))
  timers.clear()
})

defineExpose({
  addToast,
  removeToast
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}
</style>
