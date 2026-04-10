<template>
  <div class="w-full h-full overflow-y-auto bg-slate-950 pt-16 cyber-grid-bg relative text-slate-200">
    <!-- Background Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#020617]/95 to-[#0f172a]/90 pointer-events-none -z-10"></div>
    <div class="absolute top-20 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    <div class="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

    <main class="pt-8 pb-12 px-8 max-w-[1600px] mx-auto relative z-10">
      <div class="flex justify-between items-end mb-8 border-b border-cyan-500/30 pb-4">
        <div>
          <h1 class="text-4xl font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)] uppercase">历史任务库</h1>
          <p class="text-cyan-500/70 text-sm font-mono tracking-widest uppercase">DATABANK / HISTORICAL_RECORDS / ALL_ARCHIVES</p>
        </div>
        <div class="flex gap-4">
          <button class="bg-slate-900/60 border border-cyan-500/30 text-cyan-400 px-5 py-2.5 rounded text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-cyan-900/40 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:border-cyan-400">
            <span class="material-symbols-outlined text-sm">download</span>
            EXPORT_DATA
          </button>
          <button class="cyber-button px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <span class="material-symbols-outlined text-sm">filter_list</span>
            ADVANCED_FILTER
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-r from-cyan-500 to-purple-600 p-[1px] rounded-xl relative group">
          <div class="bg-[#0f172a]/90 backdrop-blur-xl h-full p-6 rounded-xl relative overflow-hidden hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
            <div class="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_#00f0ff]"></div>
            <div class="relative z-10">
              <p class="text-[10px] text-cyan-500/70 mb-1 font-bold uppercase tracking-widest font-mono">TOTAL_TASKS (MONTH)</p>
              <h3 class="text-3xl font-black text-cyan-300 glow-text-cyan">{{ stats.totalTasks }}</h3>
              <p class="text-[10px] text-purple-400 mt-2 font-mono">{{ stats.momGrowth >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.momGrowth) }}% MoM</p>
            </div>
            <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-cyan-500/10 text-8xl rotate-12 group-hover:scale-110 transition-transform duration-500">train</span>
          </div>
        </div>
        <div class="bg-gradient-to-r from-cyan-500 to-purple-600 p-[1px] rounded-xl relative group">
          <div class="bg-[#0f172a]/90 backdrop-blur-xl h-full p-6 rounded-xl relative overflow-hidden hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
            <div class="absolute top-0 left-0 w-1 h-full bg-purple-500 shadow-[0_0_10px_#b026ff]"></div>
            <div class="relative z-10">
              <p class="text-[10px] text-purple-400/70 mb-1 font-bold uppercase tracking-widest font-mono">ACCURACY_RATE</p>
              <h3 class="text-3xl font-black text-purple-300 glow-text-purple">{{ stats.accuracy }}%</h3>
              <p class="text-[10px] text-slate-400 mt-2 font-mono">Based on manual verification</p>
            </div>
            <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-purple-500/10 text-8xl rotate-12 group-hover:scale-110 transition-transform duration-500">verified</span>
          </div>
        </div>
        <div class="bg-gradient-to-r from-cyan-500 to-purple-600 p-[1px] rounded-xl relative group">
          <div class="bg-[#0f172a]/90 backdrop-blur-xl h-full p-6 rounded-xl relative overflow-hidden hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
            <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
            <div class="relative z-10">
              <p class="text-[10px] text-emerald-500/70 mb-1 font-bold uppercase tracking-widest font-mono">UPTIME_HOURS</p>
              <h3 class="text-3xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">{{ stats.uptimeHours }}h</h3>
              <p class="text-[10px] text-emerald-400/70 mt-2 font-mono">SYSTEM: NOMINAL</p>
            </div>
            <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-emerald-500/10 text-8xl rotate-12 group-hover:scale-110 transition-transform duration-500">health_and_safety</span>
          </div>
        </div>
        <div class="bg-gradient-to-r from-cyan-500 to-purple-600 p-[1px] rounded-xl relative group">
          <div class="bg-[#0f172a]/90 backdrop-blur-xl h-full p-6 rounded-xl relative overflow-hidden hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all">
            <div class="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse"></div>
            <div class="relative z-10">
              <p class="text-[10px] text-red-400/70 mb-1 font-bold uppercase tracking-widest font-mono">PENDING_ERRORS</p>
              <h3 class="text-3xl font-black text-red-400 glow-text-red">{{ stats.pendingErrors }}</h3>
              <p class="text-[10px] text-red-400 mt-2 underline cursor-pointer hover:text-red-300 font-mono tracking-widest uppercase">Action Required</p>
            </div>
            <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-red-500/10 text-8xl rotate-12 group-hover:scale-110 transition-transform duration-500">warning</span>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="glass-panel rounded-xl border border-cyan-500/30 overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.05)]">
        <div class="p-4 border-b border-cyan-500/30 flex justify-between items-center bg-slate-900/60">
          <div class="flex items-center gap-4">
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50 text-sm group-focus-within:text-cyan-400 transition-colors">search</span>
              <input type="text" placeholder="Search ID / Location..." class="bg-slate-950/50 border border-cyan-500/30 text-cyan-100 text-xs rounded pl-9 pr-4 py-2 w-72 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] focus:outline-none transition-all placeholder:text-slate-500 font-mono tracking-wider">
            </div>
          </div>
          <div class="flex items-center gap-4 text-[10px] text-cyan-500/70 font-bold font-mono tracking-widest uppercase">
            <span>DISPLAY: {{ taskStore.pagination?.total > 0 ? ((taskStore.pagination?.page || 1) - 1) * (taskStore.pagination?.limit || 10) + 1 : 0 }}-{{ Math.min((taskStore.pagination?.page || 1) * (taskStore.pagination?.limit || 10), taskStore.pagination?.total || 0) }} / TOTAL: {{ taskStore.pagination?.total || 0 }}</span>
            <div class="flex gap-1">
              <button @click="prevPage" :disabled="taskStore.pagination?.page <= 1" class="p-1.5 hover:text-cyan-300 hover:bg-cyan-900/40 rounded border border-transparent hover:border-cyan-500/30 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"><span class="material-symbols-outlined text-sm">chevron_left</span></button>
              <button @click="nextPage" :disabled="taskStore.pagination?.page >= taskStore.pagination?.totalPages" class="p-1.5 hover:text-cyan-300 hover:bg-cyan-900/40 rounded border border-transparent hover:border-cyan-500/30 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"><span class="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        </div>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] text-cyan-500/70 uppercase tracking-[0.2em] bg-slate-900/40 border-b border-cyan-500/20 font-mono">
              <th class="px-6 py-4 font-bold">TASK_ID</th>
              <th class="px-6 py-4 font-bold">TIMESTAMP</th>
              <th class="px-6 py-4 font-bold text-center">CAR_COUNT</th>
              <th class="px-6 py-4 font-bold text-center">ERRORS</th>
              <th class="px-6 py-4 font-bold">STATUS</th>
              <th class="px-6 py-4 font-bold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-cyan-500/10">
            <tr v-if="taskStore.loading" class="text-center">
              <td colspan="6" class="px-6 py-16 text-cyan-500/50">
                <div class="flex flex-col items-center gap-4">
                  <span class="material-symbols-outlined animate-spin text-4xl shadow-[0_0_15px_#00f0ff] rounded-full">refresh</span>
                  <span class="text-xs font-mono tracking-widest uppercase">FETCHING_ARCHIVES...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="taskStore.tasks.length === 0" class="text-center">
              <td colspan="6" class="px-6 py-16 text-cyan-500/40">
                <div class="flex flex-col items-center gap-3">
                  <span class="material-symbols-outlined text-5xl opacity-30 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">dns</span>
                  <span class="text-xs font-bold tracking-[0.2em] font-mono uppercase">DATABANK_EMPTY</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="task in taskStore.tasks" :key="task.id" class="hover:bg-cyan-900/40 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors tracking-wider">#{{ task.code || task.id }}</span>
                  <span class="text-[10px] text-slate-500 font-mono">{{ task.location || 'UNKNOWN_LOC' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-xs text-slate-400 font-mono">{{ task.timestamp || task.createdAt || 'UNKNOWN_TIME' }}</td>
              <td class="px-6 py-4 text-sm font-mono text-center text-cyan-100">{{ task.totalCars || task.total || 0 }}</td>
              <td class="px-6 py-4 text-center">
                <span v-if="task.errorCount > 0" class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-900/40 text-[10px] text-red-400 font-bold border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse">{{ task.errorCount }}</span>
                <span v-else class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-[10px] text-slate-500 font-mono border border-slate-700">0</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="task.status === 'completed'" class="inline-flex items-center px-2.5 py-1 rounded bg-purple-900/30 text-purple-300 text-[9px] font-bold border border-purple-500/30 uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(176,38,255,0.1)]">COMPLETED</span>
                <span v-else-if="task.status === 'error'" class="inline-flex items-center px-2.5 py-1 rounded bg-red-900/30 text-red-400 text-[9px] font-bold border border-red-500/30 uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(239,68,68,0.1)]">FAULT</span>
                <span v-else class="inline-flex items-center px-2.5 py-1 rounded bg-cyan-900/30 text-cyan-400 text-[9px] font-bold border border-cyan-500/30 uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(0,240,255,0.1)]">ACTIVE</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="enterWorkspace(task)" class="inline-flex items-center gap-2 bg-slate-800/80 border border-cyan-500/30 px-4 py-2 rounded text-[10px] font-bold text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all active:scale-95 uppercase tracking-widest hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  ACCESS
                  <span class="material-symbols-outlined text-sm">login</span>
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
