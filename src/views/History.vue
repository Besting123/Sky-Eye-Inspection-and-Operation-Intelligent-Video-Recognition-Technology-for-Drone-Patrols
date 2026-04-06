<template>
  <div class="w-full h-full overflow-y-auto bg-surface-container-low">
    <main class="pt-12 pb-12 px-8 max-w-[1600px] mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-4xl font-black tracking-tight text-on-surface mb-2">历史任务库</h1>
          <p class="text-on-surface-variant text-sm">查看、检索与分析系统已处理的所有编组识别任务数据。</p>
        </div>
        <div class="flex gap-3">
          <button class="bg-surface-container-high border border-outline-variant/30 text-on-surface-variant px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors">
            <span class="material-symbols-outlined text-sm">download</span>
            导出报告
          </button>
          <button class="bg-primary text-on-primary px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:brightness-110 transition-all">
            <span class="material-symbols-outlined text-sm">filter_list</span>
            高级筛选
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-surface-container-high p-6 rounded-xl relative overflow-hidden group">
          <div class="relative z-10">
            <p class="text-xs text-on-surface-variant mb-1 font-bold uppercase tracking-widest">本月识别总数</p>
            <h3 class="text-3xl font-black text-primary">2,842</h3>
            <p class="text-[10px] text-tertiary mt-2">↑ 12% 较上月同期</p>
          </div>
          <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-primary/5 text-8xl rotate-12">train</span>
        </div>
        <div class="bg-surface-container-high p-6 rounded-xl relative overflow-hidden group">
          <div class="relative z-10">
            <p class="text-xs text-on-surface-variant mb-1 font-bold uppercase tracking-widest">综合准确率</p>
            <h3 class="text-3xl font-black text-on-surface">99.8%</h3>
            <p class="text-[10px] text-on-surface-variant mt-2">基于人工复核修正数据</p>
          </div>
          <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-on-surface/5 text-8xl rotate-12">verified</span>
        </div>
        <div class="bg-surface-container-high p-6 rounded-xl relative overflow-hidden group">
          <div class="relative z-10">
            <p class="text-xs text-on-surface-variant mb-1 font-bold uppercase tracking-widest">累计无故障运行</p>
            <h3 class="text-3xl font-black text-secondary">4,120h</h3>
            <p class="text-[10px] text-secondary mt-2">系统状态良好</p>
          </div>
          <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-secondary/5 text-8xl rotate-12">health_and_safety</span>
        </div>
        <div class="bg-error-container/10 border border-error/20 p-6 rounded-xl relative overflow-hidden group">
          <div class="relative z-10">
            <p class="text-xs text-error mb-1 font-bold uppercase tracking-widest">待复核异常</p>
            <h3 class="text-3xl font-black text-error">12</h3>
            <p class="text-[10px] text-error mt-2 underline cursor-pointer hover:text-error-dim">点击立即处理</p>
          </div>
          <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-error/10 text-8xl rotate-12">warning</span>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-surface-container-high rounded-xl border border-outline-variant/20 overflow-hidden">
        <div class="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-highest">
          <div class="flex items-center gap-4">
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input type="text" placeholder="搜索任务编号 / 车位号..." class="bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm rounded pl-9 pr-4 py-2 w-64 focus:border-primary focus:outline-none transition-colors">
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs text-on-surface-variant font-bold">
            <span>显示 1-10 共 2,842 条</span>
            <div class="flex gap-1 ml-2">
              <button class="p-1 hover:text-on-surface bg-surface-container rounded"><span class="material-symbols-outlined text-sm">chevron_left</span></button>
              <button class="p-1 hover:text-on-surface bg-surface-container rounded"><span class="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        </div>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-xs text-on-surface-variant uppercase tracking-widest bg-surface-container/50 border-b border-outline-variant/20">
              <th class="px-6 py-4 font-bold">任务标识</th>
              <th class="px-6 py-4 font-bold">时间戳</th>
              <th class="px-6 py-4 font-bold text-center">车厢总数</th>
              <th class="px-6 py-4 font-bold text-center">异常数</th>
              <th class="px-6 py-4 font-bold">状态</th>
              <th class="px-6 py-4 font-bold text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="task in historyList" :key="task.id" class="hover:bg-surface-variant/40 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-on-surface">{{ task.code }}</span>
                  <span class="text-[10px] text-on-surface-variant">{{ task.location }}</span>
                </div>
              </td>
              <td class="px-6 py-5 text-sm text-on-surface-variant">{{ task.timestamp }}</td>
              <td class="px-6 py-5 text-sm font-mono text-center">{{ task.total }}</td>
              <td class="px-6 py-5 text-center">
                <span v-if="task.errorCount > 0" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-error-container/20 text-xs text-error font-bold border border-error/30 animate-pulse">{{ task.errorCount }}</span>
                <span v-else class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-container text-xs text-on-surface-variant">0</span>
              </td>
              <td class="px-6 py-5">
                <span v-if="task.status === 'completed'" class="inline-flex items-center px-2 py-1 rounded bg-tertiary-container/10 text-tertiary text-[10px] font-bold border border-tertiary/20">已完成</span>
                <span v-else-if="task.status === 'error'" class="inline-flex items-center px-2 py-1 rounded bg-error-container/10 text-error text-[10px] font-bold border border-error/20">有异常</span>
                <span v-else class="inline-flex items-center px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-bold border border-primary/20">处理中</span>
              </td>
              <td class="px-6 py-5 text-right">
                <button @click="enterWorkspace" class="inline-flex items-center gap-2 bg-surface-container px-4 py-2 rounded text-xs font-bold text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95">
                  进入工作区
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const historyList = ref([
  { id: 1, code: 'TASK-RW-20231105-01', location: '京广线 - 04号进站口', timestamp: '2023-11-05 14:22:10', total: 48, errorCount: 0, status: 'completed' },
  { id: 2, code: 'TASK-RW-20231105-02', location: '沪昆线 - 08号进站口', timestamp: '2023-11-05 15:45:33', total: 52, errorCount: 3, status: 'error' },
  { id: 3, code: 'TASK-RW-20231105-03', location: '陇海线 - 21号进站口', timestamp: '2023-11-05 16:10:05', total: 45, errorCount: 0, status: 'processing' },
  { id: 4, code: 'TASK-RW-20231105-04', location: '京九线 - 02号进站口', timestamp: '2023-11-05 18:20:00', total: 50, errorCount: 0, status: 'completed' }
])

const enterWorkspace = () => {
  router.push('/')
}
</script>
