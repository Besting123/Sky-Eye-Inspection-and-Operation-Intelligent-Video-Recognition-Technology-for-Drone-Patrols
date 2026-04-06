/**
 * API 服务层 - HTTP 客户端封装
 * 基于 Fetch API 实现,支持请求拦截、响应处理、错误统一处理
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

/**
 * HTTP 请求配置
 */
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
    this.token = null
  }

  /**
   * 设置认证 Token
   */
  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  /**
   * 获取认证 Token
   */
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token')
    }
    return this.token
  }

  /**
   * 构建请求头
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  /**
   * 处理响应
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    const data = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const error = new Error(data.error?.message || '请求失败')
      error.code = data.error?.code || 'UNKNOWN_ERROR'
      error.status = response.status
      error.details = data.error?.details
      throw error
    }

    return data
  }

  /**
   * GET 请求
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`)
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key])
      }
    })

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders()
    })

    return this.handleResponse(response)
  }

  /**
   * POST 请求
   */
  async post(endpoint, body = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    })

    return this.handleResponse(response)
  }

  /**
   * POST 请求 (FormData)
   */
  async postFormData(endpoint, formData) {
    const headers = {}
    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    })

    return this.handleResponse(response)
  }

  /**
   * PATCH 请求
   */
  async patch(endpoint, body = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    })

    return this.handleResponse(response)
  }

  /**
   * DELETE 请求
   */
  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    })

    if (response.status === 204) {
      return { success: true }
    }

    return this.handleResponse(response)
  }
}

// 创建单例实例
const apiClient = new ApiClient()

/**
 * 认证 API
 */
export const authApi = {
  /**
   * 用户登录
   */
  login(username, password) {
    return apiClient.post('/auth/login', { username, password })
  },

  /**
   * 刷新 Token
   */
  refreshToken(refreshToken) {
    return apiClient.post('/auth/refresh', { refreshToken })
  }
}

/**
 * 任务管理 API
 */
export const taskApi = {
  /**
   * 创建识别任务
   */
  createTask(videoFile, metadata) {
    const formData = new FormData()
    formData.append('video', videoFile)
    formData.append('metadata', JSON.stringify(metadata))
    
    return apiClient.postFormData('/tasks', formData)
  },

  /**
   * 获取任务列表
   */
  getTasks(params = {}) {
    return apiClient.get('/tasks', params)
  },

  /**
   * 获取任务详情
   */
  getTaskDetail(taskId) {
    return apiClient.get(`/tasks/${taskId}`)
  },

  /**
   * 删除任务
   */
  deleteTask(taskId) {
    return apiClient.delete(`/tasks/${taskId}`)
  },

  /**
   * 获取车厢识别结果
   */
  getTaskCars(taskId) {
    return apiClient.get(`/tasks/${taskId}/cars`)
  },

  /**
   * 更新车厢识别结果 (人工复核)
   */
  updateCar(taskId, carId, data) {
    return apiClient.patch(`/tasks/${taskId}/cars/${carId}`, data)
  },

  /**
   * 获取异常列表
   */
  getTaskErrors(taskId) {
    return apiClient.get(`/tasks/${taskId}/errors`)
  },

  /**
   * 处理异常
   */
  resolveError(taskId, errorId, data) {
    return apiClient.post(`/tasks/${taskId}/errors/${errorId}/resolve`, data)
  }
}

/**
 * 统计分析 API
 */
export const statisticsApi = {
  /**
   * 获取统计概览
   */
  getOverview(period = 'month') {
    return apiClient.get('/statistics/overview', { period })
  },

  /**
   * 导出报告
   */
  exportReport(taskIds, format = 'pdf', includeImages = true) {
    return apiClient.post('/reports/export', {
      taskIds,
      format,
      includeImages
    })
  }
}

/**
 * 设置全局 Token
 */
export function setAuthToken(token) {
  apiClient.setToken(token)
}

/**
 * 清除全局 Token
 */
export function clearAuthToken() {
  apiClient.setToken(null)
}

export default apiClient
