<template>
  <header class="bg-[#020617]/70 backdrop-blur-xl border-b border-cyan-500/50 shadow-[0_4px_30px_rgba(6,182,212,0.15)] flex justify-between items-center px-6 h-16 w-full fixed top-0 z-50 font-['Outfit'] leading-[1.5] text-sm text-cyan-400">
    <div class="flex items-center gap-8">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50 shadow-neon-cyan relative overflow-hidden">
          <div class="absolute inset-0 bg-primary/20 animate-pulse-slow"></div>
          <span class="material-symbols-outlined text-primary text-xl z-10">train</span>
        </div>
        <span class="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">铁路编组识别工作站</span>
      </div>
      <nav class="flex gap-6 font-['Inter']">
        <router-link 
          to="/" 
          class="transition-all duration-300 ease-in-out px-3 py-1.5 rounded-md relative group"
          :class="[route.path === '/' ? 'text-cyan-400 font-bold bg-cyan-900/30' : 'text-slate-300 hover:text-cyan-400 hover:bg-cyan-900/20 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]']"
        >
          <span class="relative z-10">识别工作区</span>
          <div v-if="route.path === '/'" class="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
        </router-link>
        <router-link 
          to="/history" 
          class="transition-all duration-300 ease-in-out px-3 py-1.5 rounded-md relative group"
          :class="[route.path === '/history' ? 'text-purple-400 font-bold bg-purple-900/30' : 'text-slate-300 hover:text-purple-400 hover:bg-purple-900/20 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]']"
        >
          <span class="relative z-10">历史任务库</span>
          <div v-if="route.path === '/history'" class="absolute bottom-0 left-0 h-0.5 w-full bg-purple-400 shadow-[0_0_10px_#c084fc]"></div>
        </router-link>
      </nav>
    </div>
    <div class="flex items-center gap-4">
      <button class="p-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all rounded-lg relative group">
        <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#b026ff] animate-pulse"></span>
        <span class="material-symbols-outlined group-hover:drop-shadow-[0_0_5px_#00f0ff]">notifications</span>
      </button>
      <div class="flex items-center gap-3 ml-2 pl-4 border-l border-outline-variant relative">
        <div class="flex items-center gap-2 cursor-pointer hover:bg-surface-container-high p-1.5 rounded-lg transition-colors">
          <div class="w-8 h-8 rounded-full bg-surface-container-highest border border-primary/50 flex items-center justify-center text-primary font-bold uppercase shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            A
          </div>
          <span class="text-on-surface font-medium">Admin</span>
          <span class="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
