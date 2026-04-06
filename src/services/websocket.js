class WebSocketClient {
  constructor(url) {
    this.url = url || import.meta.env.VITE_WS_URL || 'ws://localhost:3000/api/v1/ws'
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.messageHandlers = new Map()
    this.isIntentionallyClosed = false
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      const wsUrl = token ? `${this.url}?token=${token}` : this.url
      
      try {
        this.ws = new WebSocket(wsUrl)
        this.isIntentionallyClosed = false

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error)
          reject(error)
        }

        this.ws.onclose = (event) => {
          console.log('[WebSocket] Disconnected:', event.code, event.reason)
          
          if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnect(token)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  reconnect(token) {
    this.reconnectAttempts++
    console.log(`[WebSocket] Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(() => {
      this.connect(token).catch(error => {
        console.error('[WebSocket] Reconnection failed:', error)
      })
    }, this.reconnectDelay)
  }

  disconnect() {
    this.isIntentionallyClosed = true
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageHandlers.clear()
  }

  send(type, payload) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('[WebSocket] Cannot send message: not connected')
      return false
    }

    try {
      this.ws.send(JSON.stringify({ type, payload }))
      return true
    } catch (error) {
      console.error('[WebSocket] Failed to send message:', error)
      return false
    }
  }

  subscribe(taskId) {
    return this.send('subscribe', { taskId })
  }

  on(messageType, handler) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, [])
    }
    this.messageHandlers.get(messageType).push(handler)
  }

  off(messageType, handler) {
    if (!this.messageHandlers.has(messageType)) return
    
    const handlers = this.messageHandlers.get(messageType)
    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
    }
  }

  handleMessage(message) {
    const { type, payload } = message
    
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.get(type).forEach(handler => {
        try {
          handler(payload)
        } catch (error) {
          console.error(`[WebSocket] Handler error for ${type}:`, error)
        }
      })
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

const wsClient = new WebSocketClient()

export default wsClient
