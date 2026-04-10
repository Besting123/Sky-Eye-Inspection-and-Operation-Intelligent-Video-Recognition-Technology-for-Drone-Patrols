<template>
  <div class="min-h-screen w-full bg-light-gray flex items-center justify-center font-body">
    <div class="w-full max-w-md px-6">
      <div class="bg-white rounded-large shadow-apple p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-apple-blue/10 rounded-large flex items-center justify-center mx-auto mb-6 border border-apple-blue/20">
            <span class="material-symbols-outlined text-apple-blue text-4xl">train</span>
          </div>
          <h1 class="text-section-heading font-display text-text-primary mb-2">系统登录</h1>
          <p class="text-caption text-text-tertiary">Railway Recognition Workstation</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-2">
            <label class="text-caption-bold text-text-primary block">用户名</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-lg">person</span>
              <input 
                v-model="username" 
                type="text" 
                required
                class="w-full bg-light-gray border border-text-primary/10 rounded-comfortable py-3 pl-11 pr-4 text-body text-text-primary placeholder-text-tertiary focus:outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 transition-all duration-200"
                placeholder="请输入用户名"
              >
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-caption-bold text-text-primary block">密码</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-lg">lock</span>
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                required
                class="w-full bg-light-gray border border-text-primary/10 rounded-comfortable py-3 pl-11 pr-11 text-body text-text-primary placeholder-text-tertiary focus:outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 transition-all duration-200"
                placeholder="请输入密码"
              >
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors duration-200"
              >
                <span class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <div class="pt-2">
            <button 
              type="submit" 
              :disabled="authStore.loading"
              class="apple-button-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="authStore.loading" class="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              <span>{{ authStore.loading ? '登录中...' : '登录' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    showToast({
      title: '验证失败',
      message: '请输入用户名和密码',
      type: 'warning'
    })
    return
  }

  try {
    await authStore.login(username.value, password.value)
    showToast({
      title: '认证成功',
      message: '正在进入工作站',
      type: 'success'
    })
    router.push('/')
  } catch (error) {
    showToast({
      title: '认证失败',
      message: error.response?.data?.message || error.message || '用户名或密码无效',
      type: 'error'
    })
  }
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
