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
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()

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
