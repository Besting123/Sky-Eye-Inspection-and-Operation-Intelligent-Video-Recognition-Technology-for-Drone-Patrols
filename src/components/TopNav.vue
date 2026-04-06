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
      <div class="flex items-center gap-3 ml-2 pl-4 border-l border-outline-variant/30">
        <img alt="用户头像" class="w-8 h-8 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIU12JX9HN6K9WrE0mxWq_DOO_k-RfSxiov2JolypKftJr9mBdMF9FnLlH1YTnoVlfFUwbgTmUOZB6N4Rk8sXaS372THhPuhYuHJUUtt07VY1sXulsT-A7nL_U6AL7NKuDsxGBsVduOi5cAg-4z6GPUU8k9EsPr05Ds1vj5Q3_bobx6AZPGB2ENK8sfOZN6ybp8Uv3LnH6GMhvoqVqTtWIhzLfj2BgAqLOUe2fju8-I7IwBQgsmqu4_6FImedcmhQekUZE-0rHH7w"/>
        <span class="material-symbols-outlined text-[#a6acb2]">account_circle</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
