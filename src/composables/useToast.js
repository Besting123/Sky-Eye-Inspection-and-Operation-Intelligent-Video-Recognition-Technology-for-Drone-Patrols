import { ref } from 'vue'

const toasts = ref([])
let toastId = 0
const timers = new Map()

export function useToast() {
  function showToast(options) {
    let title, message, type, duration;
    
    if (typeof options === 'object' && options !== null) {
      title = options.title || '';
      message = options.message || '';
      type = options.type || 'info';
      duration = options.duration !== undefined ? options.duration : 5000;
    } else {
      message = options;
      type = arguments[1] || 'info';
      duration = arguments[2] !== undefined ? arguments[2] : 5000;
    }

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
  
  return {
    toasts,
    showToast,
    removeToast
  }
}
