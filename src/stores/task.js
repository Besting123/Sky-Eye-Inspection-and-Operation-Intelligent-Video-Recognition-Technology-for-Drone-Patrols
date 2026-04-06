import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskApi } from '../services/api'
import wsClient from '../services/websocket'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const activeTaskId = ref(null)
  const currentTask = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({ total: 0, page: 1, limit: 10, totalPages: 0 })

  const activeTask = computed(() => {
    if (!activeTaskId.value) return null
    return tasks.value.find(t => t.id === activeTaskId.value) || currentTask.value
  })

  const pendingTasks = computed(() => 
    tasks.value.filter(t => t.status === 'pending' || t.status === 'processing')
  )

  const completedTasks = computed(() => 
    tasks.value.filter(t => t.status === 'completed')
  )

  async function fetchTasks(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await taskApi.getTasks(params)
      tasks.value = response.data.tasks
      if (response.data.pagination) {
        pagination.value = response.data.pagination
      }
      return response
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchTaskDetail(taskId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await taskApi.getTaskDetail(taskId)
      currentTask.value = response.data
      
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      
      return response.data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createTask(videoFile, metadata, uploadCallbacks = null) {
    loading.value = true
    error.value = null
    
    try {
      const response = await taskApi.createTask(videoFile, metadata, uploadCallbacks)
      const newTask = response.data
      
      tasks.value.unshift(newTask)
      activeTaskId.value = newTask.taskId
      
      if (wsClient.isConnected()) {
        wsClient.subscribe(newTask.taskId)
      }
      
      if (uploadCallbacks?.onComplete) {
        uploadCallbacks.onComplete()
      }
      
      return { success: true, data: newTask }
    } catch (e) {
      error.value = e.message
      
      if (uploadCallbacks?.onError) {
        uploadCallbacks.onError(e)
      }
      
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(taskId) {
    loading.value = true
    error.value = null
    
    try {
      await taskApi.deleteTask(taskId)
      tasks.value = tasks.value.filter(t => t.id !== taskId)
      
      if (activeTaskId.value === taskId) {
        activeTaskId.value = null
        currentTask.value = null
      }
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCar(taskId, carId, data) {
    try {
      const response = await taskApi.updateCar(taskId, carId, data)
      
      if (currentTask.value && currentTask.value.id === taskId) {
        const carIndex = currentTask.value.cars.findIndex(c => c.id === carId)
        if (carIndex !== -1) {
          currentTask.value.cars[carIndex] = {
            ...currentTask.value.cars[carIndex],
            ...response.data
          }
        }
      }
      
      return response.data
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  async function resolveError(taskId, errorId, data) {
    try {
      await taskApi.resolveError(taskId, errorId, data)
      
      if (currentTask.value && currentTask.value.id === taskId) {
        await fetchTaskDetail(taskId)
      }
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  function setActiveTask(taskId) {
    activeTaskId.value = taskId
    
    if (taskId && wsClient.isConnected()) {
      wsClient.subscribe(taskId)
    }
  }

  function updateTaskProgress(payload) {
    const { taskId, status, progress, currentCar, totalCars } = payload
    
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = status
      task.progress = progress
    }
    
    if (currentTask.value && currentTask.value.id === taskId) {
      currentTask.value.status = status
      currentTask.value.progress = progress
      if (currentCar !== undefined) {
        currentTask.value.recognition = {
          ...currentTask.value.recognition,
          recognizedCars: currentCar,
          totalCars
        }
      }
    }
  }

  function addRecognizedCar(payload) {
    const { taskId, car } = payload
    
    if (currentTask.value && currentTask.value.id === taskId) {
      if (!currentTask.value.cars) {
        currentTask.value.cars = []
      }
      currentTask.value.cars.push(car)
    }
  }

  function addRecognitionError(payload) {
    const { taskId, error: errorData } = payload
    
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.errorCount = (task.errorCount || 0) + 1
      task.status = 'error'
    }
    
    if (currentTask.value && currentTask.value.id === taskId) {
      currentTask.value.recognition.errorCount = (currentTask.value.recognition.errorCount || 0) + 1
    }
  }

  function markTaskCompleted(payload) {
    const { taskId, status, totalCars, errorCount, accuracy } = payload
    
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = status
      task.totalCars = totalCars
      task.errorCount = errorCount
      task.progress = 100
    }
    
    if (currentTask.value && currentTask.value.id === taskId) {
      currentTask.value.status = status
      currentTask.value.progress = 100
      currentTask.value.recognition = {
        ...currentTask.value.recognition,
        totalCars,
        errorCount,
        accuracy
      }
    }
  }

  function setupWebSocketListeners() {
    wsClient.on('task_progress', updateTaskProgress)
    wsClient.on('car_recognized', addRecognizedCar)
    wsClient.on('recognition_error', addRecognitionError)
    wsClient.on('task_completed', markTaskCompleted)
  }

  function clearWebSocketListeners() {
    wsClient.off('task_progress', updateTaskProgress)
    wsClient.off('car_recognized', addRecognizedCar)
    wsClient.off('recognition_error', addRecognitionError)
    wsClient.off('task_completed', markTaskCompleted)
  }

  function clearError() {
    error.value = null
  }

  return {
    tasks,
    activeTaskId,
    currentTask,
    loading,
    error,
    pagination,
    activeTask,
    pendingTasks,
    completedTasks,
    fetchTasks,
    fetchTaskDetail,
    createTask,
    deleteTask,
    updateCar,
    resolveError,
    setActiveTask,
    setupWebSocketListeners,
    clearWebSocketListeners,
    clearError
  }
})
