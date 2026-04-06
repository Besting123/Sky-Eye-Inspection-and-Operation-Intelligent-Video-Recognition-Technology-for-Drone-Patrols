import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, setAuthToken, clearAuthToken } from '../services/api'
import wsClient from '../services/websocket'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const refreshToken = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isOperator = computed(() => user.value?.role === 'operator' || isAdmin.value)

  function loadFromStorage() {
    const storedToken = localStorage.getItem('auth_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      refreshToken.value = storedRefreshToken
      user.value = JSON.parse(storedUser)
      setAuthToken(storedToken)
    }
  }

  async function login(username, password) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.login(username, password)
      const { token: newToken, refreshToken: newRefreshToken, user: userData } = response.data

      token.value = newToken
      refreshToken.value = newRefreshToken
      user.value = userData

      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('refresh_token', newRefreshToken)
      localStorage.setItem('user', JSON.stringify(userData))

      setAuthToken(newToken)

      await connectWebSocket()

      return userData
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    token.value = null
    refreshToken.value = null
    user.value = null

    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')

    clearAuthToken()
    wsClient.disconnect()
  }

  async function refreshAuthToken() {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await authApi.refreshToken(refreshToken.value)
      const { token: newToken, refreshToken: newRefreshToken } = response.data

      token.value = newToken
      refreshToken.value = newRefreshToken

      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('refresh_token', newRefreshToken)

      setAuthToken(newToken)

      return newToken
    } catch (e) {
      await logout()
      throw e
    }
  }

  async function connectWebSocket() {
    if (!token.value) return

    try {
      await wsClient.connect(token.value)
    } catch (e) {
      console.error('WebSocket connection failed:', e)
    }
  }

  function clearError() {
    error.value = null
  }

  loadFromStorage()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isOperator,
    login,
    logout,
    refreshAuthToken,
    connectWebSocket,
    clearError
  }
})
