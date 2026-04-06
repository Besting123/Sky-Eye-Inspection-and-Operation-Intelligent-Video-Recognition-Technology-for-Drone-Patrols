<template>
  <div class="min-h-screen w-full bg-[#0c0e10] flex items-center justify-center relative overflow-hidden font-['Inter']">
    <!-- Background noise and glow -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-[20%] left-[30%] w-[40rem] h-[40rem] bg-[#7bd3ed]/10 rounded-full blur-[120px] animate-pulse mix-blend-screen"></div>
      <div class="absolute bottom-[10%] right-[20%] w-[30rem] h-[30rem] bg-[#7bd3ed]/5 rounded-full blur-[100px] animate-pulse mix-blend-screen" style="animation-delay: 2s;"></div>
      
      <!-- Grid pattern for industrial feel -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#a6acb211_1px,transparent_1px),linear-gradient(to_bottom,#a6acb211_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)] opacity-30"></div>
    </div>

    <div class="z-10 w-full max-w-[440px] px-6 relative animate-fade-in-up">
      <div class="bg-[#161a1d]/90 backdrop-blur-2xl border border-[#a6acb2]/10 rounded-[2rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden group hover:border-[#7bd3ed]/30 transition-colors duration-500">
        
        <!-- Top accent line scanning effect -->
        <div class="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
          <div class="absolute top-0 left-[-100%] right-[100%] h-full bg-gradient-to-r from-transparent via-[#7bd3ed] to-transparent w-[200%] animate-[scan_3s_ease-in-out_infinite] opacity-70"></div>
        </div>

        <!-- Header -->
        <div class="text-center mb-10">
          <div class="w-20 h-20 bg-[#0c0e10] rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#a6acb2]/20 shadow-[0_0_30px_rgba(123,211,237,0.1)] group-hover:scale-105 group-hover:border-[#7bd3ed]/40 transition-all duration-500 ease-out relative">
            <div class="absolute inset-0 bg-[#7bd3ed]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span class="material-symbols-outlined text-[40px] text-[#7bd3ed]">train</span>
          </div>
          <h1 class="text-3xl font-black tracking-tight text-white mb-2 font-['Inter']">系统登录</h1>
          <p class="text-[#a6acb2] text-sm uppercase tracking-widest font-medium">Railway Recognition Workstation</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-2">
            <label class="text-[11px] font-bold text-[#a6acb2] ml-1 uppercase tracking-widest">用户名 / Username</label>
            <div class="relative group/input">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#a6acb2] group-focus-within/input:text-[#7bd3ed] transition-colors duration-300">person</span>
              <input 
                v-model="username" 
                type="text" 
                required
                class="w-full bg-[#0c0e10]/80 border border-[#a6acb2]/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-[#a6acb2]/40 focus:outline-none focus:border-[#7bd3ed]/50 focus:ring-1 focus:ring-[#7bd3ed]/50 transition-all duration-300 font-medium"
                placeholder="请输入用户名"
              >
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center ml-1">
              <label class="text-[11px] font-bold text-[#a6acb2] uppercase tracking-widest">密码 / Password</label>
            </div>
            <div class="relative group/input">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#a6acb2] group-focus-within/input:text-[#7bd3ed] transition-colors duration-300">lock</span>
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                required
                class="w-full bg-[#0c0e10]/80 border border-[#a6acb2]/20 rounded-xl py-4 pl-12 pr-12 text-white placeholder-[#a6acb2]/40 focus:outline-none focus:border-[#7bd3ed]/50 focus:ring-1 focus:ring-[#7bd3ed]/50 transition-all duration-300 font-medium tracking-wide"
                placeholder="••••••••"
              >
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[#a6acb2] hover:text-white transition-colors duration-300 flex items-center justify-center outline-none"
              >
                <span class="material-symbols-outlined text-[20px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <div class="pt-4">
            <button 
              type="submit" 
              :disabled="authStore.loading"
              class="w-full bg-[#7bd3ed] hover:bg-[#6ac2dc] text-[#0c0e10] font-black tracking-widest uppercase rounded-xl py-4 px-4 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(123,211,237,0.2)] hover:shadow-[0_0_30px_rgba(123,211,237,0.4)] group/btn"
            >
              <span v-if="authStore.loading" class="material-symbols-outlined animate-spin">progress_activity</span>
              <span>{{ authStore.loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM' }}</span>
              <span v-if="!authStore.loading" class="material-symbols-outlined text-[22px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
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
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
