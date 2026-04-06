<template>
  <div class="view-container w-full h-full flex">
    <!-- SideNavBar -->
    <aside class="bg-[#0c0e10] h-full w-64 border-r border-[#a6acb2]/10 flex flex-col pt-4 font-['Inter'] leading-[1.5] text-[0.75rem] shrink-0">
      <div class="px-4 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
          <div>
            <div class="text-[#7bd3ed] font-bold text-sm">任务控制台</div>
            <div class="text-[#a6acb2] opacity-60">系统就绪</div>
          </div>
        </div>
        <button @click="isModalOpen = true" class="w-full py-2.5 bg-[#7bd3ed] text-[#0c0e10] font-bold rounded flex items-center justify-center gap-2 hover:bg-[#5dbad6] active:scale-95 duration-200">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          新建识别任务
        </button>
      </div>
      
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="px-4 mb-2 text-[#a6acb2] uppercase tracking-widest opacity-50 font-bold">任务列表</div>
        <nav class="flex-1 space-y-1 overflow-y-auto px-2 no-scrollbar">
          <!-- Tasks -->
          <div v-if="loading && tasks.length === 0" class="p-4 text-center text-[#a6acb2]/50 text-xs flex flex-col items-center gap-2">
            <span class="material-symbols-outlined animate-spin">refresh</span>
            加载中...
          </div>
          <div v-else-if="tasks.length === 0" class="p-8 text-center text-[#a6acb2]/50 text-xs flex flex-col items-center gap-2">
            <span class="material-symbols-outlined text-2xl mb-1">inbox</span>
            No tasks found
          </div>
          <div v-for="task in tasks" :key="task.id" @click="activeTaskId = task.id"
               class="p-3 cursor-pointer rounded transition-all group mb-1"
               :class="[activeTaskId === task.id ? 'bg-[#7bd3ed]/10 text-[#7bd3ed] border-l-2 border-[#7bd3ed]' : 'hover:bg-[#7bd3ed]/5 text-[#a6acb2]']">
            <div class="flex justify-between items-start mb-1">
              <span class="font-bold text-sm group-hover:text-on-surface" :class="{'text-[#7bd3ed]': activeTaskId === task.id}">任务 #{{ task.id }}</span>
              <span :class="getStatusClass(task.status)">{{ getStatusText(task.status) }}</span>
            </div>
            <div class="text-[10px]" :class="[activeTaskId === task.id ? 'text-[#7bd3ed]/70' : 'text-[#a6acb2]/50']">{{ formatDate(task.createdAt) }}</div>
          </div>
        </nav>
      </div>
    </aside>

    <!-- WS Content View Wrapper -->
    <div class="flex flex-1 w-full">
      
      <!-- Central Workspace (Main) -->
      <main v-if="!selectedTaskDetails" class="flex-1 flex flex-col bg-[#0c0e10] overflow-hidden">
        <div class="flex-1 relative bg-[#161a1d] flex items-center justify-center group">
          <div class="text-[#a6acb2]/50 text-center">
            <span class="material-symbols-outlined text-4xl mb-4">train</span>
            <p>请在左侧选择一个任务或创建新任务</p>
          </div>
        </div>
      </main>

      <!-- Right Side: Results & Relations (Main) -->
      <aside v-if="!selectedTaskDetails" class="w-[380px] bg-[#161a1d] border-l border-[#a6acb2]/10 flex flex-col shrink-0">
        <div class="p-4 border-b border-[#a6acb2]/10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-[#7bd3ed]">结果与关系区</h2>
          </div>
          <div class="text-[#a6acb2]/50 text-xs text-center py-8">
            请选择任务以查看识别结果
          </div>
        </div>
      </aside>

      <!-- Task Details (Secondary Layout) -->
      <main v-if="selectedTaskDetails" class="flex-1 flex flex-col bg-[#0c0e10] min-w-0">
        <!-- Browser-like Tabs -->
        <div class="flex bg-[#161a1d] px-2 pt-2 border-b border-[#a6acb2]/10">
          <div class="flex items-center bg-[#0c0e10] text-[#7bd3ed] px-4 py-2 rounded-t-lg gap-2 text-xs font-medium border-x border-t border-[#a6acb2]/20">
            <span class="material-symbols-outlined text-sm">analytics</span>任务 #{{ activeTaskId }}
            <span @click="activeTaskId = null" class="material-symbols-outlined text-xs opacity-50 hover:opacity-100 cursor-pointer">close</span>
          </div>
        </div>
        <!-- Breadcrumbs -->
        <div class="px-6 py-3 flex items-center gap-2 text-[11px] text-[#a6acb2] border-b border-[#a6acb2]/10 bg-[#0c0e10]">
          <span>识别工作区</span>
          <span class="material-symbols-outlined text-[12px]">chevron_right</span>
          <span class="text-white font-medium">任务 #{{ activeTaskId }} ({{ formatDate(activeTask.createdAt) }} 巡检监控)</span>
        </div>
        <!-- Content Workspace -->
        <div class="flex-1 flex overflow-hidden">
          <div class="flex-1 bg-[#161a1d] p-4 flex flex-col gap-4">
            <div class="flex-1 relative rounded-xl overflow-hidden border border-[#a6acb2]/20 group bg-black">
              <BoundingBoxOverlay
                v-if="activeTask.thumbnailUrl || activeTask.videoUrl"
                :mediaUrl="activeTask.videoUrl || activeTask.thumbnailUrl"
                :mediaType="activeTask.videoUrl ? 'video' : 'image'"
                :boxes="activeTask.cars || []"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-[#a6acb2]/50 gap-4">
                <span class="material-symbols-outlined text-5xl opacity-50">videocam_off</span>
                <span class="text-sm font-bold tracking-wider uppercase">No video data</span>
              </div>
              <!-- Video Controls Overlay -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 bg-[#0c0e10]/90 backdrop-blur-xl rounded-full border border-[#a6acb2]/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="material-symbols-outlined cursor-pointer hover:text-[#7bd3ed] text-white">skip_previous</span>
                <span class="material-symbols-outlined cursor-pointer text-[#7bd3ed] scale-125" style="font-variation-settings: 'FILL' 1;">pause_circle</span>
                <span class="material-symbols-outlined cursor-pointer hover:text-[#7bd3ed] text-white">skip_next</span>
                <div class="h-4 w-px bg-[#a6acb2]/30"></div>
                <div class="flex items-center gap-2 text-white">
                  <span class="text-[10px] font-mono">{{ activeTask.progress || 0 }}% 完成</span>
                  <div class="w-32 h-1 bg-[#a6acb2]/30 rounded-full relative">
                    <div class="absolute top-0 left-0 h-full bg-[#7bd3ed] rounded-full" :style="{ width: (activeTask.progress || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Right Data Sidebar Details -->
          <div class="w-80 bg-[#161a1d] flex flex-col border-l border-[#a6acb2]/10">
            <div class="p-4 border-b border-[#a6acb2]/10 flex justify-between items-center">
              <div>
                <h3 class="text-sm font-bold text-white">编组识别详情</h3>
                <p class="text-[11px] text-[#a6acb2]">识别进度: {{ activeTask.progress || 0 }}%</p>
              </div>
              <button @click="isDrawerOpen = true" class="bg-red-400/20 text-red-400 text-[10px] px-2 py-1 rounded border border-red-400/30 hover:bg-red-400/40 transition-colors">异常复核</button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <div v-if="!activeTask.cars || activeTask.cars.length === 0" class="text-center text-[#a6acb2]/50 text-xs py-8">
                尚未识别到车厢
              </div>
              <div v-for="(car, index) in activeTask.cars" :key="car.id || index" class="p-3 bg-[#0c0e10] rounded-lg border-l-4 border-[#7bd3ed]">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-bold text-[#7bd3ed]">车厢 #{{ index + 1 }}</span>
                  <span class="bg-[#7bd3ed]/20 text-[#7bd3ed] text-[9px] px-1.5 py-0.5 rounded-sm">{{ car.status || '已确认' }}</span>
                </div>
                <div class="space-y-2 text-white">
                  <div>
                    <label class="text-[10px] text-[#a6acb2] block">车号 (Car ID)</label>
                    <div class="text-sm font-mono font-bold">{{ car.carNumber || '未知' }}</div>
                  </div>
                  <div class="pl-3 border-l border-[#a6acb2]/30 mt-2" v-if="car.containerNumber">
                    <label class="text-[10px] text-[#a6acb2] block">箱号 (Container ID)</label>
                    <div class="text-xs font-mono">{{ car.containerNumber }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 bg-[#0c0e10] border-t border-[#a6acb2]/10">
              <button class="w-full py-2 bg-transparent border border-[#7bd3ed] text-[#7bd3ed] text-xs font-bold rounded-lg hover:bg-[#7bd3ed]/10 transition-colors">生成编组清单报告</button>
            </div>
          </div>
        </div>
      </main>

    </div>

    <!-- UI States: Drawer (Sliding out) -->
    <div :class="[isDrawerOpen ? 'translate-x-0' : 'translate-x-full']" class="fixed inset-y-0 right-0 w-80 bg-[#161a1d] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] z-50 transform border-l border-[#a6acb2]/20 transition-transform duration-300">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-red-400">异常复核</h3>
          <button @click="isDrawerOpen = false" class="text-[#a6acb2] hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="space-y-4">
          <div v-if="!activeTask?.exceptions?.length" class="text-center text-[#a6acb2]/50 text-xs py-8">
            暂无异常
          </div>
          <div v-for="exception in activeTask?.exceptions || []" :key="exception.id" class="p-3 bg-red-400/10 border border-red-400/20 rounded">
            <div class="text-xs font-bold text-red-400 mb-2">{{ exception.type }}</div>
            <img v-if="exception.imageUrl" class="w-full h-24 object-cover rounded mb-2" :src="exception.imageUrl"/>
            <div class="flex gap-2">
              <button @click="handleResolveError(activeTask.id, exception.id, 'ignore')" class="flex-1 bg-[#0c0e10] text-[#a6acb2] hover:text-white py-1 text-[10px] rounded transition-colors">忽略</button>
              <button @click="handleResolveError(activeTask.id, exception.id, 'manual')" class="flex-1 bg-red-400 hover:bg-red-500 text-white py-1 text-[10px] rounded transition-colors">人工标记</button>
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
  if (status === 'pending' || status === 'processing') return 'bg-[#7bd3ed]/20 text-[#7bd3ed] px-1.5 py-0.5 rounded text-[9px] font-bold'
  if (status === 'completed') return 'bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded text-[9px] font-bold'
  if (status === 'error') return 'bg-error-container/20 text-error px-1.5 py-0.5 rounded text-[9px] font-bold'
  return ''
}

const getStatusText = (status) => {
  const map = {
    pending: '等待中',
    processing: '处理中',
    completed: '已完成',
    error: '异常'
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
