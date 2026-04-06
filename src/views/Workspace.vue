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
        <button @click="isModalOpen = true" class="w-full py-2.5 bg-primary text-on-primary font-bold rounded flex items-center justify-center gap-2 active:scale-95 duration-200">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          新建识别任务
        </button>
      </div>
      
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="px-4 mb-2 text-[#a6acb2] uppercase tracking-widest opacity-50 font-bold">任务列表</div>
        <nav class="flex-1 space-y-1 overflow-y-auto px-2 no-scrollbar">
          <!-- Tasks -->
          <div v-for="task in tasks" :key="task.id" @click="activeTaskId = task.id"
               class="p-3 cursor-pointer rounded transition-all group"
               :class="[activeTaskId === task.id ? 'bg-[#7bd3ed]/10 text-[#7bd3ed] border-l-2 border-[#7bd3ed]' : 'hover:bg-[#7bd3ed]/5 text-[#a6acb2]']">
            <div class="flex justify-between items-start mb-1">
              <span class="font-bold text-sm group-hover:text-on-surface" :class="{'text-[#7bd3ed]': activeTaskId === task.id}">任务 #{{ task.id }}</span>
              <span :class="getStatusClass(task.status)">{{ task.statusText }}</span>
            </div>
            <div class="text-[10px]" :class="[activeTaskId === task.id ? 'text-[#7bd3ed]/70' : 'text-[#a6acb2]/50']">{{ task.date }}</div>
          </div>
        </nav>
      </div>
    </aside>

    <!-- WS Content View Wrapper -->
    <div class="flex flex-1 w-full">
      
      <!-- Central Workspace (Main) -->
      <main v-if="!selectedTaskDetails" class="flex-1 flex flex-col bg-surface overflow-hidden">
        <div class="flex-1 relative bg-surface-container-lowest flex items-center justify-center group">
          <img alt="货运列车识别" class="max-w-full max-h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1R09WJbpY1Erdoajf-8tdBvMwjs1_IsqOBdull53Qz2PGVzBiV-fimPAiZuff4a3Z4buwMMvUJRtcPhQLAiwSYmCvbYuQz-Pds6Ncktpmh_xzxplwFcIjOFo3xm27kHWqQs3kBKKRoNRNWiyhKuGmA5SRVxRjCMyCLUYGoLDsxqIa3ylR-CjZ8l7rvHcgfik6LP34hE2f0LOCZ6dR2mDA3yeWuy9erLsCDd_fze_H_m8mr9ykN17TMpoRlhUdeha80ogOSRretbo"/>
          <!-- Image Controls -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-surface-container/90 backdrop-blur rounded-full border border-outline-variant/20 shadow-2xl transition-opacity">
            <button class="p-2 hover:bg-surface-bright rounded-full transition-colors"><span class="material-symbols-outlined">zoom_in</span></button>
            <button class="p-2 hover:bg-surface-bright rounded-full transition-colors"><span class="material-symbols-outlined">zoom_out</span></button>
            <div class="w-px h-4 bg-outline-variant/30 mx-1"></div>
            <button class="p-2 hover:bg-surface-bright rounded-full transition-colors"><span class="material-symbols-outlined">chevron_left</span></button>
            <button class="p-2 hover:bg-surface-bright rounded-full transition-colors"><span class="material-symbols-outlined">chevron_right</span></button>
            <div class="w-px h-4 bg-outline-variant/30 mx-1"></div>
            <button class="p-2 hover:bg-surface-bright rounded-full transition-colors"><span class="material-symbols-outlined">fullscreen</span></button>
            <button class="p-2 hover:bg-surface-bright rounded-full transition-colors"><span class="material-symbols-outlined">layers</span></button>
          </div>
        </div>
      </main>

      <!-- Right Side: Results & Relations (Main) -->
      <aside v-if="!selectedTaskDetails" class="w-[380px] bg-surface-container-high border-l border-outline-variant/10 flex flex-col shrink-0">
        <div class="p-4 border-b border-outline-variant/10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-primary">结果与关系区</h2>
            <button @click="isDrawerOpen = true" class="bg-error-container/20 text-error text-[10px] px-2 py-1 rounded border border-error/30 hover:bg-error-container/40 transition-colors">异常复核</button>
          </div>
          <div class="flex gap-1 bg-surface-container-lowest p-1 rounded">
            <button class="flex-1 py-1.5 text-[11px] font-bold bg-surface-variant text-primary rounded shadow-sm">整体编组</button>
            <button class="flex-1 py-1.5 text-[11px] text-on-surface-variant hover:text-on-surface">当前车节</button>
            <button class="flex-1 py-1.5 text-[11px] text-on-surface-variant hover:text-on-surface">关联箱号</button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <!-- Train Car List Mockup -->
          <div class="p-2 space-y-2">
            <!-- Expanded Car -->
            <div class="bg-surface-container-highest rounded overflow-hidden border border-primary/20">
              <div class="p-3 flex items-center justify-between cursor-pointer">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-black text-primary/40">01</span>
                  <div>
                    <div class="text-sm font-bold text-primary">车号 GH921</div>
                    <div class="text-[10px] text-on-surface-variant">类型: C70 平车 | 状态: 已确认</div>
                  </div>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
              </div>
              <div class="bg-surface-container-low p-2 space-y-1">
                <div class="flex items-center justify-between p-2 rounded bg-surface-container-highest border-l-2 border-tertiary">
                  <div>
                    <div class="text-[11px] font-bold">MSKU2094821</div>
                    <div class="text-[9px] text-on-surface-variant">40HC 集装箱 / 重箱</div>
                  </div>
                  <span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer border-l-2 border-outline-variant/30">
                  <div>
                    <div class="text-[11px] font-bold">COSU6281930</div>
                    <div class="text-[9px] text-on-surface-variant">40GP 集装箱 / 空箱</div>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant text-sm">info</span>
                </div>
              </div>
            </div>
            
            <div class="bg-surface-container-low hover:bg-surface-container-highest rounded p-3 flex items-center justify-between cursor-pointer transition-colors border border-outline-variant/5">
              <div class="flex items-center gap-3">
                <span class="text-xs font-black text-on-surface-variant/40">02</span>
                <div>
                  <div class="text-sm font-bold">车号 TK442</div>
                  <div class="text-[10px] text-on-surface-variant">类型: P62 箱车</div>
                </div>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant text-sm">expand_less</span>
            </div>
            
            <div class="bg-surface-container-low hover:bg-surface-container-highest rounded p-3 flex items-center justify-between cursor-pointer transition-colors border border-outline-variant/5">
              <div class="flex items-center gap-3">
                <span class="text-xs font-black text-on-surface-variant/40">03</span>
                <div>
                  <div class="text-sm font-bold">车号 ER091</div>
                  <div class="text-[10px] text-on-surface-variant text-error flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">warning</span>待复核
                  </div>
                </div>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant text-sm">expand_less</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Task Details (Secondary Layout) -->
      <main v-if="selectedTaskDetails" class="flex-1 flex flex-col bg-background min-w-0">
        <!-- Browser-like Tabs -->
        <div class="flex bg-surface-container-low px-2 pt-2 border-b border-outline-variant/5">
          <div class="flex items-center bg-surface-container-high text-primary px-4 py-2 rounded-t-lg gap-2 text-xs font-medium border-x border-t border-outline-variant/10">
            <span class="material-symbols-outlined text-sm">analytics</span>任务 #{{ activeTaskId }}
            <span @click="activeTaskId = '8293'" class="material-symbols-outlined text-xs opacity-50 hover:opacity-100 cursor-pointer">close</span>
          </div>
          <button class="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
        <!-- Breadcrumbs -->
        <div class="px-6 py-3 flex items-center gap-2 text-[11px] text-on-surface-variant border-b border-outline-variant/5 bg-surface-dim">
          <span>识别工作区</span>
          <span class="material-symbols-outlined text-[12px]">chevron_right</span>
          <span class="text-on-surface font-medium">任务 #{{ activeTaskId }} (2026-04-04 巡检监控)</span>
        </div>
        <!-- Content Workspace -->
        <div class="flex-1 flex overflow-hidden">
          <div class="flex-1 bg-surface-container-lowest p-4 flex flex-col gap-4">
            <div class="flex-1 relative rounded-xl overflow-hidden border border-outline-variant/10 group bg-black">
              <img alt="Railway Workspace" class="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhpVuu6sd8muMWT2Dto9DLsjVvhYUjT_Z66wT2Qgwk7O6D05BxJjpUVv-qyKdMoKASjVeyzo73ushvp7ZqTnI3QweiYt_VFa2uyEggVTwprs_gj_roEyIrCGc5_s1zjqE50nxIGVYqFoHE7dbPkakN-M2zc6aB_VBf2aBf0J2vcuXnrP0iAE_-8rcRv7qn8ZQUKbSHyC51jRgQ87BmQfb-84sus1NQf7OHh36pUTmDoWWmDfSURz1BWHKPx4FSYM_ev_vfqJRQWbo"/>
              <!-- Video Controls Overlay -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 bg-surface-container/90 backdrop-blur-xl rounded-full border border-outline-variant/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="material-symbols-outlined cursor-pointer hover:text-primary">skip_previous</span>
                <span class="material-symbols-outlined cursor-pointer text-primary scale-125" style="font-variation-settings: 'FILL' 1;">pause_circle</span>
                <span class="material-symbols-outlined cursor-pointer hover:text-primary">skip_next</span>
                <div class="h-4 w-px bg-outline-variant"></div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono">02:45 / 12:00</span>
                  <div class="w-32 h-1 bg-surface-variant rounded-full relative">
                    <div class="absolute top-0 left-0 h-full w-[22%] bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Thumbnail Strip -->
            <div class="h-24 flex gap-2 overflow-x-auto pb-2">
              <div class="flex-none w-36 h-full rounded border-2 border-primary/40 overflow-hidden relative translate-y-[-2px]">
                <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaQTpp9csSrMNylqmz0Plnk8T2z3_TTmzN-t8oW6JV0sf8CZyx4M0GGDbufknE8UMW2lc-mtU873wZ7_OZh4p3B-RQu6yD5BUuMR3QCTEfbv41Bs4XOoJH7S9fCxHBb10Fqmxj9nkyyD2NqFeLY4u3lJ4KCHrVChLr1Ow55lGEw9b6t5zoqrd0eOJhzYM1a8xSIw30G7r8SumBNN-UzQ2CAlSTL_30c9ZWvu8oIQ6bq3b1IMRVfU4_4HbZ-BNVnrYOyE6VuMpXajo"/>
                <div class="absolute inset-0 bg-primary/10"></div>
              </div>
              <div class="flex-none w-36 h-full rounded border border-outline-variant/20 overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
                <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUvQJuLLLIfON3DUTtWwSLStXtrXE6ndHoMwHcZ8VLWpWwqzKhiyl4IrOqFQlcl1TZL2zfWJSDOAenynILL4M92HaHsBvQlke_lxgyi1hYyXE5roIm7RZzpMxgD5rwoI3abi4oMx4ulR8yYXiWQkGoa_Tez19QuNzaaiWwOTUanZ1gEzChtBW2Q-Z-75VxvHfb6qpD-6eYYyzcrjqY64EhB1nDdvW8aFhrEOzVqsZpQrGfgUI8cqZMI0GdN9fMk1pAS5_cYnpAQBA"/>
              </div>
            </div>
          </div>
          <!-- Right Data Sidebar Details -->
          <div class="w-80 bg-surface-container-high flex flex-col border-l border-outline-variant/10">
            <div class="p-4 border-b border-outline-variant/10">
              <h3 class="text-sm font-bold text-on-surface">编组识别详情</h3>
              <p class="text-[11px] text-on-surface-variant">识别成功率: 98.4%</p>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <div class="p-3 bg-surface-container-highest rounded-lg border-l-4 border-primary">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-bold text-primary">车厢 #01</span>
                  <span class="bg-tertiary-container text-on-tertiary-container text-[9px] px-1.5 py-0.5 rounded-sm">已确认</span>
                </div>
                <div class="space-y-2">
                  <div>
                    <label class="text-[10px] text-on-surface-variant block">车号 (Car ID)</label>
                    <div class="text-sm font-mono font-bold">GH921</div>
                  </div>
                  <div class="pl-3 border-l border-outline-variant/30 mt-2">
                    <label class="text-[10px] text-on-surface-variant block">箱号 (Container ID)</label>
                    <div class="text-xs font-mono">MSKU2094821</div>
                    <div class="text-[9px] text-on-surface-variant mt-1">MAERSK LOGISTICS</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 bg-surface-container-lowest border-t border-outline-variant/10">
              <button class="w-full py-2 bg-transparent border border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary/5 transition-colors">生成编组清单报告</button>
            </div>
          </div>
        </div>
      </main>

    </div>

    <!-- UI States: Drawer (Sliding out) -->
    <div :class="[isDrawerOpen ? 'translate-x-0' : 'translate-x-full']" class="fixed inset-y-0 right-0 w-80 glass-panel shadow-[-20px_0_60px_rgba(0,0,0,0.5)] z-50 transform border-l border-outline-variant/20 transition-transform duration-300">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-error">异常复核</h3>
          <button @click="isDrawerOpen = false" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="space-y-4">
          <div class="p-3 bg-error-container/10 border border-error/20 rounded">
            <div class="text-xs font-bold text-error mb-2">车号遮挡 (车节 #08)</div>
            <img class="w-full h-24 object-cover rounded mb-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLsC361MHu0Lbkb8LSgvPUi_DC6XZHqjaP5IhIeI7hwbPr_Y30LhhsTXgJ-2GgjS1dcIktDnJfil1dM9yFFZ9TBGOZAOkcMfxVeCnAgTguALfNbgceez3IunlsUzCJ5fk00K-5lxyK_bu5iZ78ur4axXSx7bakAIt6VgK3Dg5mHJRY-K_KoSDuw0uVkQsPcpYVrdyAh4I688Sqa5M5oCu_g4x9Cv83tNWATzG-vUixd7tm_Axbud6ZEnLb9l8zZl0c2odzTZnyn9o"/>
            <div class="flex gap-2">
              <button class="flex-1 bg-surface-container-highest py-1 text-[10px] rounded">忽略</button>
              <button class="flex-1 bg-error text-white py-1 text-[10px] rounded">人工标记</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal (New Task) -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div class="w-[500px] bg-surface-container-high rounded border border-outline-variant/30 shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 class="text-xl font-bold">新建识别任务</h3>
          <button @click="isModalOpen = false" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="p-8">
          <div class="border-2 border-dashed border-outline-variant/50 rounded p-12 flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer group">
            <span class="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors mb-4">cloud_upload</span>
            <div class="text-sm font-bold mb-1">点击或拖拽视频文件至此处</div>
            <div class="text-xs text-on-surface-variant">支持 MP4, AVI, MOV (最大 2GB)</div>
          </div>
        </div>
        <div class="p-4 bg-surface-container-highest flex justify-end gap-3">
          <button @click="isModalOpen = false" class="px-6 py-2 text-sm text-on-surface-variant hover:text-on-surface">取消</button>
          <button @click="createTask" class="px-6 py-2 bg-primary text-on-primary font-bold rounded">开始识别</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isModalOpen = ref(false)
const isDrawerOpen = ref(false)
const activeTaskId = ref('8293')

const tasks = ref([
  { id: '8293', status: 'pending', statusText: '待复核', date: '2023-11-24 14:30' },
  { id: '8292', status: 'completed', statusText: '已完成', date: '2023-11-24 13:15' },
  { id: '8291', status: 'error', statusText: '异常', date: '2023-11-24 11:45' },
  { id: '8290', status: 'completed', statusText: '已完成', date: '2023-11-24 10:20' }
])

const selectedTaskDetails = computed(() => activeTaskId.value !== '8293')

const getStatusClass = (status) => {
  if (status === 'pending') return 'bg-[#7bd3ed]/20 text-[#7bd3ed] px-1.5 py-0.5 rounded text-[9px] font-bold'
  if (status === 'completed') return 'bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded text-[9px] font-bold'
  if (status === 'error') return 'bg-error-container/20 text-error px-1.5 py-0.5 rounded text-[9px] font-bold'
  return ''
}

const createTask = () => {
  isModalOpen.value = false
  tasks.value.unshift({
    id: String(Math.floor(Math.random() * 9000) + 1000),
    status: 'pending',
    statusText: '处理中',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  })
}
</script>
