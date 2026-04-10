<template>
  <div class="view-container w-full h-full flex pt-16 bg-light-gray relative text-primary">
    <!-- SideNavBar -->
    <aside class="h-full w-64 bg-white border-r border-primary/10 flex flex-col pt-6 shrink-0 m-2 rounded-standard overflow-hidden shadow-apple">
      <div class="px-4 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-2 h-2 rounded-full bg-apple-blue"></div>
          <div>
            <div class="text-primary font-semibold text-sm">任务控制台</div>
            <div class="text-tertiary text-[10px]">就绪</div>
          </div>
        </div>
        <button @click="isModalOpen = true" class="apple-button-primary w-full py-2 rounded-standard flex items-center justify-center gap-2 text-sm font-normal">
          <span class="material-symbols-outlined text-base">add_circle</span>
          新建识别任务
        </button>
      </div>
      
      <div class="flex-1 flex flex-col overflow-hidden relative">
        <div class="px-4 mb-2 text-secondary text-[11px] font-semibold">
          任务列表
        </div>
        <nav class="flex-1 space-y-1 overflow-y-auto px-2 no-scrollbar">
          <!-- Tasks -->
          <div v-if="loading && tasks.length === 0" class="p-4 text-center text-secondary text-xs flex flex-col items-center gap-2">
            <span class="material-symbols-outlined animate-spin">refresh</span>
            加载中...
          </div>
          <div v-else-if="tasks.length === 0" class="p-8 text-center text-tertiary text-xs flex flex-col items-center gap-2">
            <span class="material-symbols-outlined text-2xl mb-1">inbox</span>
            暂无任务
          </div>
          <div v-for="task in tasks" :key="task.id" @click="activeTaskId = task.id"
               class="p-3 cursor-pointer rounded-standard transition-all duration-200 group mb-2 border border-transparent"
               :class="[activeTaskId === task.id ? 'bg-apple-blue/10 border-apple-blue/30' : 'hover:bg-primary/5']">
            <div class="flex justify-between items-start mb-1">
              <span class="font-semibold text-sm transition-colors" :class="[activeTaskId === task.id ? 'text-apple-blue' : 'text-primary']">任务 #{{ task.id }}</span>
              <span :class="getStatusClass(task.status)">{{ getStatusText(task.status) }}</span>
            </div>
            <div class="text-[10px] transition-colors" :class="[activeTaskId === task.id ? 'text-secondary' : 'text-tertiary']">{{ formatDate(task.createdAt) }}</div>
          </div>
        </nav>
      </div>
    </aside>

    <!-- WS Content View Wrapper -->
    <div class="flex flex-1 w-full h-full p-2 relative">
      
      <!-- Central Workspace (Main) -->
      <main v-if="!selectedTaskDetails" class="bg-white border border-primary/10 flex-1 flex flex-col rounded-large overflow-hidden shadow-apple mr-2">
        <div class="flex-1 relative flex items-center justify-center">
          <div class="text-tertiary text-center flex flex-col items-center">
            <div class="w-24 h-24 rounded-full border-2 border-primary/10 flex items-center justify-center mb-6">
              <span class="material-symbols-outlined text-5xl text-secondary">radar</span>
            </div>
            <h3 class="font-semibold text-sm mb-2 text-secondary">等待输入</h3>
            <p class="text-xs text-tertiary">选择任务或创建新任务</p>
          </div>
        </div>
      </main>

      <!-- Right Side: Results & Relations (Main) -->
      <aside v-if="!selectedTaskDetails" class="bg-white border border-primary/10 w-[380px] rounded-large flex flex-col shrink-0 shadow-apple">
        <div class="p-4 border-b border-primary/10">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-base">hub</span>
              分析数据
            </h2>
          </div>
        </div>
        <div class="flex-1 flex items-center justify-center text-tertiary text-xs">
          待机中...
        </div>
      </aside>

      <!-- Task Details (Secondary Layout) -->
      <main v-if="selectedTaskDetails" class="bg-white border border-primary/10 flex-1 flex flex-col rounded-large overflow-hidden shadow-apple min-w-0">
        <!-- Browser-like Tabs -->
        <div class="flex bg-primary/5 px-2 pt-2 border-b border-primary/10">
          <div class="flex items-center bg-white text-primary px-4 py-2 rounded-t-standard gap-2 text-xs font-medium border-x border-t border-primary/10 shadow-sm relative">
            <span class="material-symbols-outlined text-sm">analytics</span>任务 #{{ activeTaskId }}
            <span @click="activeTaskId = null" class="material-symbols-outlined text-xs text-tertiary hover:text-primary cursor-pointer transition-colors ml-2">close</span>
          </div>
        </div>
        <!-- Breadcrumbs -->
        <div class="px-6 py-2.5 flex items-center gap-2 text-[11px] text-secondary border-b border-primary/10 bg-primary/5">
          <span class="hover:text-apple-blue cursor-pointer transition-colors">工作区</span>
          <span class="material-symbols-outlined text-[12px]">chevron_right</span>
          <span class="text-primary font-medium">任务 #{{ activeTaskId }} · {{ formatDate(activeTask.createdAt) }}</span>
        </div>
        <!-- Content Workspace -->
        <div class="flex-1 flex overflow-hidden">
          <div class="flex-1 p-4 flex flex-col gap-4 relative">
            
            <div class="flex-1 relative rounded-large overflow-hidden border border-primary/10 group bg-black shadow-apple">
              <div class="absolute top-4 right-4 z-20 flex items-center gap-2">
                 <div class="px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-[9px] rounded flex items-center gap-1">
                   <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div> 录制中
                 </div>
              </div>

              <BoundingBoxOverlay
                v-if="activeTask?.thumbnailUrl || activeTask?.videoUrl"
                :mediaUrl="activeTask?.videoUrl || activeTask?.thumbnailUrl"
                :mediaType="activeTask?.videoUrl ? 'video' : 'image'"
                :boxes="activeTask?.cars || []"
                class="w-full h-full object-contain"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-tertiary gap-4">
                <span class="material-symbols-outlined text-6xl">videocam_off</span>
                <span class="text-sm font-medium">无视频信号</span>
              </div>
              
              <!-- Video Controls Overlay -->
              <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-3 bg-white/90 backdrop-blur-md rounded-full border border-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-apple transform translate-y-2 group-hover:translate-y-0">
                <span class="material-symbols-outlined cursor-pointer hover:text-apple-blue text-secondary transition-colors">skip_previous</span>
                <span class="material-symbols-outlined cursor-pointer text-apple-blue hover:text-apple-blue/80 scale-[1.5] transition-all" style="font-variation-settings: 'FILL' 1;">pause_circle</span>
                <span class="material-symbols-outlined cursor-pointer hover:text-apple-blue text-secondary transition-colors">skip_next</span>
                <div class="h-6 w-px bg-primary/10"></div>
                <div class="flex items-center gap-3 text-primary">
                  <span class="text-[11px] font-semibold w-12 text-right">{{ activeTask.progress || 0 }}%</span>
                  <div class="w-40 h-1.5 bg-primary/10 rounded-full relative overflow-hidden">
                    <div class="absolute top-0 left-0 h-full bg-apple-blue rounded-full" :style="{ width: (activeTask.progress || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Right Data Sidebar Details -->
          <div class="w-80 bg-white flex flex-col border-l border-primary/10 z-10">
            <div class="p-4 border-b border-primary/10 flex justify-between items-center">
              <div>
                <h3 class="text-xs font-semibold text-primary">编组数据流</h3>
                <p class="text-[10px] text-secondary mt-1">处理进度: {{ activeTask.progress || 0 }}%</p>
              </div>
              <button @click="isDrawerOpen = true" class="bg-red-50 text-red-600 text-[10px] font-medium px-3 py-1.5 rounded-standard border border-red-200 hover:bg-red-100 transition-colors">异常复核</button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <div v-if="!activeTask?.cars || activeTask?.cars?.length === 0" class="flex flex-col items-center justify-center h-full text-tertiary text-xs gap-2">
                <span class="material-symbols-outlined text-2xl">data_exploration</span>
                扫描中...
              </div>
              <div v-for="(car, index) in activeTask?.cars || []" :key="car.id || index" class="p-3 bg-primary/5 rounded-standard border border-primary/10 border-l-2 hover:bg-primary/10 transition-all group" :style="{ borderLeftColor: car.status === 'error' ? '#ef4444' : '#0071e3' }">
                <div class="flex justify-between items-start mb-3">
                  <span class="text-[11px] font-semibold text-primary group-hover:text-apple-blue transition-colors">车厢 #{{ String(index + 1).padStart(3, '0') }}</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded border" :class="car.status === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-apple-blue border-blue-200'">{{ car.status || '已验证' }}</span>
                </div>
                <div class="space-y-3 text-primary">
                  <div class="bg-white p-2 rounded-standard border border-primary/10">
                    <label class="text-[9px] text-secondary block mb-1">车号</label>
                    <div class="text-sm font-semibold text-primary">{{ car.carNumber || '未知' }}</div>
                  </div>
                  <div class="bg-white p-2 rounded-standard border border-primary/10" v-if="car.containerNumber">
                    <label class="text-[9px] text-secondary block mb-1">集装箱号</label>
                    <div class="text-xs font-semibold text-primary">{{ car.containerNumber }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 bg-primary/5 border-t border-primary/10">
              <button class="apple-button-primary w-full py-2.5 text-xs font-normal rounded-standard">生成报告</button>
            </div>
          </div>
        </div>
      </main>

    </div>

    <!-- UI States: Drawer (Sliding out) -->
    <div :class="[isDrawerOpen ? 'translate-x-0' : 'translate-x-full']" class="bg-white border-l border-primary/10 fixed inset-y-0 right-0 w-80 shadow-apple z-[100] transform transition-transform duration-300 ease-out">
      <div class="p-6 h-full flex flex-col">
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-primary/10">
          <h3 class="text-sm font-semibold text-red-600 flex items-center gap-2">
            <span class="material-symbols-outlined text-base">warning</span>
            异常复核
          </h3>
          <button @click="isDrawerOpen = false" class="text-tertiary hover:text-primary transition-colors"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
          <div v-if="!activeTask?.exceptions?.length" class="flex flex-col items-center justify-center h-40 text-tertiary text-xs gap-2 border border-dashed border-primary/20 rounded-standard">
            <span class="material-symbols-outlined text-2xl">check_circle</span>
            系统正常
          </div>
          <div v-for="exception in activeTask?.exceptions || []" :key="exception.id" class="p-3 bg-red-50 border border-red-200 rounded-standard hover:border-red-300 transition-colors">
            <div class="text-[10px] font-semibold text-red-600 mb-3 flex items-center justify-between">
              {{ exception.type }}
              <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </div>
            <div class="relative rounded-standard overflow-hidden mb-3 border border-primary/10 group">
                <img v-if="exception.imageUrl" class="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" :src="exception.imageUrl"/>
                <div v-else class="w-full h-28 bg-primary/5 flex items-center justify-center text-tertiary text-[10px]">无图像数据</div>
            </div>
            <div class="flex gap-2">
              <button @click="handleResolveError(activeTask.id, exception.id, 'ignore')" class="flex-1 apple-button-secondary py-1.5 text-[10px] font-normal rounded-standard">忽略</button>
              <button @click="handleResolveError(activeTask.id, exception.id, 'manual')" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 text-[10px] font-normal rounded-standard transition-colors">人工修复</button>
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
  if (status === 'pending' || status === 'processing') return 'bg-blue-50 text-apple-blue px-1.5 py-0.5 rounded text-[9px] font-medium border border-blue-200'
  if (status === 'completed') return 'bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[9px] font-medium border border-green-200'
  if (status === 'error') return 'bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[9px] font-medium border border-red-200'
  return ''
}

const getStatusText = (status) => {
  const map = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    error: '错误'
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
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
