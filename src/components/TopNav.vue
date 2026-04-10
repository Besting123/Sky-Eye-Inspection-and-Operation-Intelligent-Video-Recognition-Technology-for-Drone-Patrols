<template>
  <header class="apple-glass-nav fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-6">
    <div class="flex items-center gap-8">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-standard bg-apple-blue/10 flex items-center justify-center border border-apple-blue/20">
          <span class="material-symbols-outlined text-apple-blue text-lg">train</span>
        </div>
        <span class="text-base font-semibold text-text-primary tracking-tight-17 font-body">铁路编组识别工作站</span>
      </div>
      <nav class="flex gap-1">
        <router-link 
          to="/" 
          class="px-3 py-1 text-xs font-body text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-micro"
          :class="[route.path === '/' ? 'text-text-primary font-semibold' : '']"
        >
          识别工作区
        </router-link>
        <router-link 
          to="/history" 
          class="px-3 py-1 text-xs font-body text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-micro"
          :class="[route.path === '/history' ? 'text-text-primary font-semibold' : '']"
        >
          历史任务库
        </router-link>
      </nav>
    </div>
    <div class="flex items-center gap-3">
      <button class="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-text-primary/5 transition-all duration-200 rounded-micro relative">
        <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error"></span>
        <span class="material-symbols-outlined text-lg">notifications</span>
      </button>
      <div class="h-6 w-px bg-text-primary/10"></div>
      <div class="flex items-center gap-2 cursor-pointer hover:bg-text-primary/5 px-2 py-1 rounded-micro transition-colors duration-200">
        <div class="w-6 h-6 rounded-full bg-apple-blue/10 border border-apple-blue/20 flex items-center justify-center text-apple-blue text-xs font-semibold">
          A
        </div>
        <span class="text-xs font-body text-text-primary">Admin</span>
        <span class="material-symbols-outlined text-text-secondary text-sm">expand_more</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
