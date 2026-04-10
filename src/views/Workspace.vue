<template>
  <div class="view-container w-full h-full flex pt-16 cyber-grid-bg relative text-slate-200">
    <!-- Background Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#020617]/95 to-[#0f172a]/90 pointer-events-none -z-10"></div>
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

    <!-- SideNavBar -->
    <aside class="glass-panel h-full w-64 border-r border-cyan-500/20 flex flex-col pt-6 font-['Inter'] leading-[1.5] text-[0.75rem] shrink-0 m-2 rounded-xl overflow-hidden relative z-10 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
      <div class="px-4 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]"></div>
          <div>
            <div class="text-cyan-400 font-bold text-sm tracking-wider uppercase drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">任务控制台</div>
            <div class="text-slate-400 opacity-80 font-mono text-[10px]">SYSTEM READY</div>
          </div>
        </div>
        <button @click="isModalOpen = true" class="w-full py-2.5 cyber-button font-bold rounded flex items-center justify-center gap-2 uppercase tracking-wider text-xs">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          新建识别任务
        </button>
      </div>
      
      <div class="flex-1 flex flex-col overflow-hidden relative">
        <div class="px-4 mb-2 text-cyan-500/70 uppercase tracking-widest opacity-80 font-bold text-[10px] flex items-center gap-2">
          <div class="h-px bg-cyan-500/30 flex-1"></div>
          任务列表
          <div class="h-px bg-cyan-500/30 flex-1"></div>
        </div>
        <nav class="flex-1 space-y-1 overflow-y-auto px-2 no-scrollbar">
          <!-- Tasks -->
          <div v-if="loading && tasks.length === 0" class="p-4 text-center text-cyan-400/50 text-xs flex flex-col items-center gap-2">
            <span class="material-symbols-outlined animate-spin shadow-[0_0_10px_#00f0ff] rounded-full">refresh</span>
            LOADING_DATA...
          </div>
          <div v-else-if="tasks.length === 0" class="p-8 text-center text-cyan-400/40 text-xs flex flex-col items-center gap-2">
            <span class="material-symbols-outlined text-2xl mb-1 opacity-50">inbox</span>
            NO TASKS FOUND
          </div>
          <div v-for="task in tasks" :key="task.id" @click="activeTaskId = task.id"
               class="p-3 cursor-pointer rounded-lg transition-all duration-300 group mb-2 border border-transparent hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
               :class="[activeTaskId === task.id ? 'bg-cyan-900/40 border-cyan-500/50 shadow-[inset_0_0_15px_rgba(0,240,255,0.15)]' : 'hover:bg-slate-800/50 hover:border-slate-700']">
            <div class="flex justify-between items-start mb-1">
              <span class="font-bold text-sm tracking-wide transition-colors" :class="[activeTaskId === task.id ? 'text-cyan-300 drop-shadow-[0_0_5px_#00f0ff]' : 'text-slate-300 group-hover:text-cyan-200']">TASK_#{{ task.id }}</span>
              <span :class="getStatusClass(task.status)">{{ getStatusText(task.status) }}</span>
            </div>
            <div class="text-[10px] font-mono transition-colors" :class="[activeTaskId === task.id ? 'text-cyan-400/70' : 'text-slate-500']">{{ formatDate(task.createdAt) }}</div>
          </div>
        </nav>
      </div>
    </aside>

    <!-- WS Content View Wrapper -->
    <div class="flex flex-1 w-full h-full p-2 relative z-10">
      
      <!-- Central Workspace (Main) -->
      <main v-if="!selectedTaskDetails" class="bg-[#0f172a]/70 backdrop-blur-xl border border-cyan-500/30 flex-1 flex flex-col rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.05)] mr-2">
        <div class="flex-1 relative flex items-center justify-center group bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGMtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNSA1IDIuMjQgNSA1LTIuMjQgNS01IDV6IiBmaWxsPSJyZ2JhKDAsMjQwLDI1NSwwLjAyKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')]">
          <div class="text-cyan-500/40 text-center flex flex-col items-center">
            <div class="w-24 h-24 rounded-full border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.05)] relative">
              <div class="absolute inset-0 rounded-full border-t border-cyan-400 animate-spin opacity-50" style="animation-duration: 3s;"></div>
              <span class="material-symbols-outlined text-5xl">radar</span>
            </div>
            <h3 class="font-bold tracking-[0.2em] uppercase text-sm mb-2 text-cyan-400/70">AWAITING INPUT</h3>
            <p class="font-mono text-[10px]">Select a task or initialize new sequence</p>
          </div>
        </div>
      </main>

      <!-- Right Side: Results & Relations (Main) -->
      <aside v-if="!selectedTaskDetails" class="bg-[#0f172a]/70 backdrop-blur-xl border border-cyan-500/30 w-[380px] rounded-xl flex flex-col shrink-0 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
        <div class="p-4 border-b border-cyan-500/20 bg-slate-900/40">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">hub</span>
              ANALYSIS_DATA
            </h2>
          </div>
        </div>
        <div class="flex-1 flex items-center justify-center text-cyan-500/30 text-xs font-mono uppercase tracking-widest">
          STANDBY...
        </div>
      </aside>

      <!-- Task Details (Secondary Layout) -->
      <main v-if="selectedTaskDetails" class="bg-[#0f172a]/70 backdrop-blur-xl border border-cyan-500/30 flex-1 flex flex-col rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)] min-w-0">
        <!-- Browser-like Tabs -->
        <div class="flex bg-slate-900/60 px-2 pt-2 border-b border-cyan-500/20">
          <div class="flex items-center bg-slate-800/80 text-cyan-300 px-4 py-2 rounded-t-lg gap-2 text-xs font-medium border-x border-t border-cyan-500/40 shadow-[0_-5px_15px_rgba(0,240,255,0.05)] relative overflow-hidden">
             <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <span class="material-symbols-outlined text-sm">analytics</span>SEQ_#{{ activeTaskId }}
            <span @click="activeTaskId = null" class="material-symbols-outlined text-xs opacity-50 hover:opacity-100 cursor-pointer hover:text-red-400 transition-colors ml-2">close</span>
          </div>
        </div>
        <!-- Breadcrumbs -->
        <div class="px-6 py-2.5 flex items-center gap-2 text-[10px] font-mono text-cyan-500/60 border-b border-cyan-500/10 bg-slate-900/40 uppercase tracking-widest">
          <span class="hover:text-cyan-400 cursor-pointer transition-colors">WORKSPACE</span>
          <span class="material-symbols-outlined text-[12px]">chevron_right</span>
          <span class="text-cyan-300 glow-text-cyan font-bold">TASK_#{{ activeTaskId }} [{{ formatDate(activeTask.createdAt) }}]</span>
        </div>
        <!-- Content Workspace -->
        <div class="flex-1 flex overflow-hidden">
          <div class="flex-1 p-4 flex flex-col gap-4 relative">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGMtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNSA1IDIuMjQgNSA1LTIuMjQgNS01IDV6IiBmaWxsPSJyZ2JhKDAsMjQwLDI1NSwwLjAxKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] pointer-events-none -z-10"></div>
            
            <div class="flex-1 relative rounded-xl overflow-hidden border border-cyan-500/30 group bg-slate-950 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div class="absolute top-4 right-4 z-20 flex items-center gap-2">
                 <div class="px-2 py-1 bg-red-500/20 border border-red-500/50 text-red-400 text-[9px] font-mono rounded flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse">
                   <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div> REC
                 </div>
              </div>

              <BoundingBoxOverlay
                v-if="activeTask?.thumbnailUrl || activeTask?.videoUrl"
                :mediaUrl="activeTask?.videoUrl || activeTask?.thumbnailUrl"
                :mediaType="activeTask?.videoUrl ? 'video' : 'image'"
                :boxes="activeTask?.cars || []"
                class="w-full h-full object-contain"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-cyan-500/40 gap-4">
                <span class="material-symbols-outlined text-6xl opacity-50 filter drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">videocam_off</span>
                <span class="text-sm font-bold tracking-[0.3em] uppercase font-mono">SIGNAL_LOST</span>
              </div>
              
              <!-- Video Controls Overlay -->
              <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-3 bg-slate-900/80 backdrop-blur-md rounded-full border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(0,240,255,0.2)] transform translate-y-4 group-hover:translate-y-0">
                <span class="material-symbols-outlined cursor-pointer hover:text-cyan-400 text-slate-300 transition-colors">skip_previous</span>
                <span class="material-symbols-outlined cursor-pointer text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_10px_#00f0ff] scale-[1.5] transition-all" style="font-variation-settings: 'FILL' 1;">pause_circle</span>
                <span class="material-symbols-outlined cursor-pointer hover:text-cyan-400 text-slate-300 transition-colors">skip_next</span>
                <div class="h-6 w-px bg-cyan-500/30"></div>
                <div class="flex items-center gap-3 text-slate-200">
                  <span class="text-[10px] font-mono text-cyan-400 font-bold w-12 text-right">{{ activeTask.progress || 0 }}%</span>
                  <div class="w-40 h-1.5 bg-slate-800 rounded-full relative overflow-hidden border border-slate-700">
                    <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-300 rounded-full shadow-[0_0_10px_#00f0ff]" :style="{ width: (activeTask.progress || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Right Data Sidebar Details -->
          <div class="w-80 bg-slate-900/50 flex flex-col border-l border-cyan-500/20 backdrop-blur-sm z-10">
            <div class="p-4 border-b border-cyan-500/20 bg-slate-800/30 flex justify-between items-center">
              <div>
                <h3 class="text-xs font-bold text-cyan-300 tracking-widest uppercase">编组数据流</h3>
                <p class="text-[10px] text-cyan-500/60 font-mono mt-1">PROCESSING: {{ activeTask.progress || 0 }}%</p>
              </div>
              <button @click="isDrawerOpen = true" class="bg-red-950/40 text-red-400 text-[10px] font-bold px-3 py-1.5 rounded border border-red-500/30 hover:bg-red-900/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all uppercase tracking-wider">异常复核</button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <div v-if="!activeTask?.cars || activeTask?.cars?.length === 0" class="flex flex-col items-center justify-center h-full text-cyan-500/40 text-xs font-mono uppercase tracking-widest gap-2">
                <span class="material-symbols-outlined text-2xl opacity-50">data_exploration</span>
                SCANNING...
              </div>
              <div v-for="(car, index) in activeTask?.cars || []" :key="car.id || index" class="p-3 bg-slate-800/40 rounded border border-cyan-500/10 border-l-2 hover:border-l-cyan-400 hover:bg-slate-800/60 transition-all group" :style="{ borderLeftColor: car.status === 'error' ? '#ef4444' : '#22d3ee' }">
                <div class="flex justify-between items-start mb-3">
                  <span class="text-[11px] font-bold text-slate-300 group-hover:text-cyan-300 transition-colors tracking-wider">CAR_#{{ String(index + 1).padStart(3, '0') }}</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded font-mono border" :class="car.status === 'error' ? 'bg-red-950/50 text-red-400 border-red-500/30' : 'bg-cyan-950/50 text-cyan-400 border-cyan-500/30'">{{ car.status || 'VERIFIED' }}</span>
                </div>
                <div class="space-y-3 text-slate-200">
                  <div class="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                    <label class="text-[9px] text-cyan-500/60 uppercase tracking-widest block mb-1">CAR_ID</label>
                    <div class="text-sm font-mono font-bold text-cyan-100 glow-text-cyan">{{ car.carNumber || 'UNKNOWN' }}</div>
                  </div>
                  <div class="bg-slate-900/50 p-2 rounded border border-slate-700/50" v-if="car.containerNumber">
                    <label class="text-[9px] text-purple-400/60 uppercase tracking-widest block mb-1">CONTAINER_ID</label>
                    <div class="text-xs font-mono font-bold text-purple-200 glow-text-purple">{{ car.containerNumber }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 bg-slate-900/80 border-t border-cyan-500/20 backdrop-blur-md">
              <button class="w-full py-2.5 cyber-button text-xs font-bold rounded uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.1)]">GENERATE_REPORT</button>
            </div>
          </div>
        </div>
      </main>

    </div>

    <!-- UI States: Drawer (Sliding out) -->
    <div :class="[isDrawerOpen ? 'translate-x-0' : 'translate-x-full']" class="bg-[#0f172a]/70 backdrop-blur-xl border border-cyan-500/30 fixed inset-y-0 right-0 w-80 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div class="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none"></div>
      <div class="p-6 h-full flex flex-col relative z-10">
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-red-500/20">
          <h3 class="text-sm font-bold text-red-400 tracking-widest uppercase flex items-center gap-2 glow-text-red">
            <span class="material-symbols-outlined text-sm">warning</span>
            EXCEPTION_REVIEW
          </h3>
          <button @click="isDrawerOpen = false" class="text-slate-400 hover:text-cyan-300 transition-colors"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
          <div v-if="!activeTask?.exceptions?.length" class="flex flex-col items-center justify-center h-40 text-cyan-500/40 text-xs font-mono uppercase tracking-widest gap-2 border border-dashed border-cyan-500/20 rounded-lg">
            <span class="material-symbols-outlined text-2xl opacity-50">check_circle</span>
            SYSTEM_CLEAR
          </div>
          <div v-for="exception in activeTask?.exceptions || []" :key="exception.id" class="p-3 bg-slate-900/60 border border-red-500/30 rounded-lg hover:border-red-400/50 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.05)]">
            <div class="text-[10px] font-bold text-red-400 mb-3 tracking-widest uppercase flex items-center justify-between">
              {{ exception.type }}
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            </div>
            <div class="relative rounded overflow-hidden mb-3 border border-slate-700 group">
                <img v-if="exception.imageUrl" class="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-500" :src="exception.imageUrl"/>
                <div v-else class="w-full h-28 bg-slate-800 flex items-center justify-center text-slate-500 font-mono text-[10px]">NO_IMAGE_DATA</div>
                <div class="absolute inset-0 bg-red-500/10 pointer-events-none mix-blend-overlay"></div>
            </div>
            <div class="flex gap-2">
              <button @click="handleResolveError(activeTask.id, exception.id, 'ignore')" class="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-600 transition-all hover:text-cyan-300">IGNORE</button>
              <button @click="handleResolveError(activeTask.id, exception.id, 'manual')" class="flex-1 bg-red-900/60 hover:bg-red-800/80 text-red-100 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border border-red-500/50 transition-all hover:shadow-[0_0_10px_rgba(239,68,68,0.4)]">MANUAL_FIX</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TaskCreateModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @submit="handleCreateTask"
    />
    <Loading ref="loadingRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useToast } from '@/composables/useToast'
import TaskCreateModal from '@/components/TaskCreateModal.vue'
import BoundingBoxOverlay from '@/components/BoundingBoxOverlay.vue'
import Loading from '@/components/Loading.vue'

const taskStore = useTaskStore()
const { showToast } = useToast()

const isModalOpen = ref(false)
const isDrawerOpen = ref(false)
const loadingRef = ref(null)

const tasks = computed(() => taskStore.tasks)
const activeTaskId = computed({
  get: () => taskStore.activeTaskId,
  set: (val) => taskStore.setActiveTask(val)
})

const activeTask = computed(() => taskStore.activeTask)
const loading = computed(() => taskStore.loading)

// Instead of relying on a mock ID like '8293', let's check if there is an activeTask
const selectedTaskDetails = computed(() => !!activeTask.value)

watch(() => taskStore.activeTaskId, async (newId) => {
  if (newId && !taskStore.currentTask || taskStore.currentTask?.id !== newId) {
    try {
      loadingRef.value?.show()
      await taskStore.fetchTaskDetail(newId)
    } catch (e) {
      showToast('获取任务详情失败', 'error')
    } finally {
      loadingRef.value?.hide()
    }
  }
})

const getStatusClass = (status) => {
  if (status === 'pending' || status === 'processing') return 'bg-cyan-900/50 text-cyan-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-cyan-500/30'
  if (status === 'completed') return 'bg-purple-900/30 text-purple-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-purple-500/30'
  if (status === 'error') return 'bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-red-500/30'
  return ''
}

const getStatusText = (status) => {
  const map = {
    pending: 'STANDBY',
    processing: 'ACTIVE',
    completed: 'DONE',
    error: 'FAULT'
  }
  return map[status] || status
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString()
}

async function handleResolveError(taskId, exceptionId, action) {
  try {
    await taskStore.resolveError(taskId, exceptionId, { action })
    showToast(action === 'ignore' ? '已忽略异常' : '已标记为人工复核', 'success')
  } catch (error) {
    showToast(error.message || '操作失败', 'error')
  }
}

async function handleCreateTask({ file, metadata, uploadCallbacks }) {
  try {
    const result = await taskStore.createTask(file, metadata, uploadCallbacks)
    
    if (result.success) {
      showToast('任务创建成功', 'success')
      isModalOpen.value = false
    }
  } catch (error) {
    showToast(error.message || '任务创建失败', 'error')
  }
}

onMounted(async () => {
  try {
    await taskStore.fetchTasks()
    taskStore.setupWebSocketListeners()
    if (tasks.value.length > 0 && !activeTaskId.value) {
      taskStore.setActiveTask(tasks.value[0].id)
    }
  } catch (e) {
    showToast('获取任务列表失败', 'error')
  }
})

onUnmounted(() => {
  taskStore.clearWebSocketListeners()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.2);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.5);
}
.glow-text-red {
  text-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}
</style>
