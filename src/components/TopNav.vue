<template>
  <header class="bg-[#0c0e10]/80 backdrop-blur-md border-b border-[#a6acb2]/10 flex justify-between items-center px-6 h-16 w-full fixed top-0 z-50 font-['Inter'] leading-[1.5] text-sm">
    <div class="flex items-center gap-8">
      <span class="text-xl font-black tracking-tight text-[#7bd3ed]">铁路编组识别工作站</span>
      <nav class="flex gap-6">
        <router-link 
          to="/" 
          class="transition-all duration-300 ease-in-out"
          :class="[route.path === '/' ? 'text-[#7bd3ed] font-bold border-b-2 border-[#7bd3ed] pb-2' : 'text-[#a6acb2] hover:text-[#7bd3ed]']"
        >识别工作区</router-link>
        <router-link 
          to="/history" 
          class="transition-all duration-300 ease-in-out"
          :class="[route.path === '/history' ? 'text-[#7bd3ed] font-bold border-b-2 border-[#7bd3ed] pb-2' : 'text-[#a6acb2] hover:text-[#7bd3ed]']"
        >历史任务库</router-link>
      </nav>
    </div>
    <div class="flex items-center gap-4">
      <button class="p-2 text-[#a6acb2] hover:bg-[#7bd3ed]/10 hover:text-[#7bd3ed] transition-all rounded-lg">
        <span class="material-symbols-outlined">notifications</span>
      </button>
      <div class="flex items-center gap-3 ml-2 pl-4 border-l border-[#a6acb2]/30 relative">
        <div class="flex items-center gap-2 cursor-default">
          <div class="w-8 h-8 rounded-full bg-[#161a1d] border border-[#a6acb2]/30 flex items-center justify-center text-[#7bd3ed] font-bold uppercase">
            A
          </div>
          <span class="text-[#a6acb2]">Admin</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
