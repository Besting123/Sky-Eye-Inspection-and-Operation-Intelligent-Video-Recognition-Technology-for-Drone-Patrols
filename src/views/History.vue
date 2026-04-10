<template>
  <div class="w-full h-full overflow-y-auto bg-[#f5f5f7] pt-16 relative text-[#1d1d1f]">
    <main class="pt-8 pb-12 px-8 max-w-[1600px] mx-auto relative">
      <div class="flex justify-between items-end mb-8 border-b border-[#1d1d1f]/10 pb-4">
        <div>
          <h1 class="text-4xl font-semibold text-[#1d1d1f] mb-2">历史任务库</h1>
          <p class="text-[#86868b] text-sm">数据库 / 历史记录 / 全部档案</p>
        </div>
        <div class="flex gap-4">
          <button class="bg-white border border-[#1d1d1f]/10 text-[#1d1d1f] px-5 py-2.5 rounded-lg text-sm font-normal flex items-center gap-2 hover:bg-[#f5f5f7] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <span class="material-symbols-outlined text-base">download</span>
            导出数据
          </button>
          <button class="bg-[#0071e3] text-white px-5 py-2.5 rounded-lg text-sm font-normal flex items-center gap-2 hover:bg-[#0077ed] transition-colors shadow-[0_2px_8px_rgba(0,113,227,0.25)]">
            <span class="material-symbols-outlined text-base">filter_list</span>
            高级筛选
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] hover:shadow-[rgba(0,0,0,0.28)_3px_8px_40px_0px] transition-shadow group">
          <div class="flex items-start justify-between mb-4">
            <span class="material-symbols-outlined text-[#0071e3] text-3xl">train</span>
          </div>
          <p class="text-sm text-[#86868b] mb-1">本月任务总数</p>
          <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-2">{{ stats.totalTasks }}</h3>
          <p class="text-xs text-[#86868b]">{{ stats.momGrowth >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.momGrowth) }}% 环比</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] hover:shadow-[rgba(0,0,0,0.28)_3px_8px_40px_0px] transition-shadow group">
          <div class="flex items-start justify-between mb-4">
            <span class="material-symbols-outlined text-[#0071e3] text-3xl">verified</span>
          </div>
          <p class="text-sm text-[#86868b] mb-1">识别准确率</p>
          <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-2">{{ stats.accuracy }}%</h3>
          <p class="text-xs text-[#86868b]">基于人工复核</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] hover:shadow-[rgba(0,0,0,0.28)_3px_8px_40px_0px] transition-shadow group">
          <div class="flex items-start justify-between mb-4">
            <span class="material-symbols-outlined text-[#34c759] text-3xl">health_and_safety</span>
          </div>
          <p class="text-sm text-[#86868b] mb-1">系统运行时长</p>
          <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-2">{{ stats.uptimeHours }}h</h3>
          <p class="text-xs text-[#34c759]">系统正常</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] hover:shadow-[rgba(0,0,0,0.28)_3px_8px_40px_0px] transition-shadow group">
          <div class="flex items-start justify-between mb-4">
            <span class="material-symbols-outlined text-[#ff3b30] text-3xl">warning</span>
          </div>
          <p class="text-sm text-[#86868b] mb-1">待处理错误</p>
          <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-2">{{ stats.pendingErrors }}</h3>
          <p class="text-xs text-[#ff3b30] underline cursor-pointer hover:text-[#ff453a]">需要处理</p>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-xl border border-[#1d1d1f]/10 overflow-hidden shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]">
        <div class="p-4 border-b border-[#1d1d1f]/10 flex justify-between items-center bg-[#f5f5f7]">
          <div class="flex items-center gap-4">
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] text-base group-focus-within:text-[#0071e3] transition-colors">search</span>
              <input type="text" placeholder="搜索 ID / 位置..." class="bg-white border border-[#1d1d1f]/10 text-[#1d1d1f] text-sm rounded-lg pl-9 pr-4 py-2 w-72 focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 focus:outline-none transition-all placeholder:text-[#86868b]">
            </div>
          </div>
          <div class="flex items-center gap-4 text-sm text-[#86868b]">
            <span>显示 {{ taskStore.pagination?.total > 0 ? ((taskStore.pagination?.page || 1) - 1) * (taskStore.pagination?.limit || 10) + 1 : 0 }}-{{ Math.min((taskStore.pagination?.page || 1) * (taskStore.pagination?.limit || 10), taskStore.pagination?.total || 0) }} / 共 {{ taskStore.pagination?.total || 0 }} 条</span>
            <div class="flex gap-1">
              <button @click="prevPage" :disabled="taskStore.pagination?.page <= 1" class="p-1.5 hover:text-[#0071e3] hover:bg-[#0071e3]/10 rounded-lg border border-transparent disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><span class="material-symbols-outlined text-base">chevron_left</span></button>
              <button @click="nextPage" :disabled="taskStore.pagination?.page >= taskStore.pagination?.totalPages" class="p-1.5 hover:text-[#0071e3] hover:bg-[#0071e3]/10 rounded-lg border border-transparent disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><span class="material-symbols-outlined text-base">chevron_right</span></button>
            </div>
          </div>
        </div>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-xs text-[#86868b] bg-[#f5f5f7] border-b border-[#1d1d1f]/10">
              <th class="px-6 py-4 font-semibold">任务 ID</th>
              <th class="px-6 py-4 font-semibold">时间戳</th>
              <th class="px-6 py-4 font-semibold text-center">车厢数</th>
              <th class="px-6 py-4 font-semibold text-center">错误</th>
              <th class="px-6 py-4 font-semibold">状态</th>
              <th class="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#1d1d1f]/10">
            <tr v-if="taskStore.loading" class="text-center">
              <td colspan="6" class="px-6 py-16 text-[#86868b]">
                <div class="flex flex-col items-center gap-4">
                  <span class="material-symbols-outlined animate-spin text-4xl text-[#0071e3]">refresh</span>
                  <span class="text-sm">正在加载数据...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="taskStore.tasks.length === 0" class="text-center">
              <td colspan="6" class="px-6 py-16 text-[#86868b]">
                <div class="flex flex-col items-center gap-3">
                  <span class="material-symbols-outlined text-5xl opacity-30">dns</span>
                  <span class="text-sm">暂无数据</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="task in taskStore.tasks" :key="task.id" class="hover:bg-[#f5f5f7] transition-colors group">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">#{{ task.code || task.id }}</span>
                  <span class="text-xs text-[#86868b]">{{ task.location || '未知位置' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-[#86868b]">{{ task.timestamp || task.createdAt || '未知时间' }}</td>
              <td class="px-6 py-4 text-sm text-center text-[#1d1d1f] font-semibold">{{ task.totalCars || task.total || 0 }}</td>
              <td class="px-6 py-4 text-center">
                <span v-if="task.errorCount > 0" class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#ff3b30]/10 text-sm text-[#ff3b30] font-semibold border border-[#ff3b30]/20">{{ task.errorCount }}</span>
                <span v-else class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#f5f5f7] text-sm text-[#86868b] border border-[#1d1d1f]/10">0</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="task.status === 'completed'" class="inline-flex items-center px-3 py-1 rounded-full bg-[#34c759]/10 text-[#34c759] text-xs font-semibold border border-[#34c759]/20">已完成</span>
                <span v-else-if="task.status === 'error'" class="inline-flex items-center px-3 py-1 rounded-full bg-[#ff3b30]/10 text-[#ff3b30] text-xs font-semibold border border-[#ff3b30]/20">错误</span>
                <span v-else class="inline-flex items-center px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-xs font-semibold border border-[#0071e3]/20">处理中</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="enterWorkspace(task)" class="inline-flex items-center gap-2 bg-[#0071e3] text-white px-4 py-2 rounded-lg text-sm font-normal hover:bg-[#0077ed] transition-colors shadow-[0_2px_8px_rgba(0,113,227,0.25)]">
                  查看详情
                  <span class="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
    <Loading ref="loadingRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/task'
import { statisticsApi } from '../services/api'
import { useToast } from '@/composables/useToast'
import Loading from '@/components/Loading.vue'

const router = useRouter()
const taskStore = useTaskStore()
const { showToast } = useToast()
const loadingRef = ref(null)

const stats = ref({
  totalTasks: 0,
  momGrowth: 0,
  accuracy: 0,
  uptimeHours: 0,
  pendingErrors: 0
})

const fetchStats = async () => {
  try {
    const res = await statisticsApi.getOverview('month')
    if (res && res.data) {
      stats.value = {
        totalTasks: res.data.totalTasks !== undefined ? res.data.totalTasks : (res.data.totalProcessed || 0),
        momGrowth: res.data.momGrowth !== undefined ? res.data.momGrowth : (res.data.monthOverMonth || 0),
        accuracy: res.data.accuracy !== undefined ? res.data.accuracy : 0,
        uptimeHours: res.data.uptimeHours !== undefined ? res.data.uptimeHours : (res.data.uptime || 0),
        pendingErrors: res.data.pendingErrors !== undefined ? res.data.pendingErrors : 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch statistics overview:', error)
    showToast('获取统计数据失败', 'error')
  }
}

const loadTasks = async (page = 1) => {
  try {
    loadingRef.value?.show()
    await taskStore.fetchTasks({ page, limit: 10 })
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    showToast('获取历史任务失败', 'error')
  } finally {
    loadingRef.value?.hide()
  }
}

onMounted(async () => {
  await Promise.all([
    fetchStats(),
    loadTasks()
  ])
})

const prevPage = () => {
  if (taskStore.pagination?.page > 1) {
    loadTasks(taskStore.pagination.page - 1)
  }
}

const nextPage = () => {
  if (taskStore.pagination?.page < taskStore.pagination?.totalPages) {
    loadTasks(taskStore.pagination.page + 1)
  }
}

const enterWorkspace = (task) => {
  router.push({ name: 'workspace-detail', params: { taskId: task.id } })
}
</script>
