<script setup lang="ts">
import { ref } from 'vue'

const menuItems = [
  { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/' },
  { name: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', path: '/projects' },
  { name: 'Requirements', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', path: '/requirements' },
  { name: 'Test Cases', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', path: '/test-cases' },
  { name: 'Bugs', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', path: '/bugs' },
]
</script>

<template>
  <aside class="w-64 border-r-neo border-border bg-surface flex flex-col h-full">
    <!-- Logo area -->
    <div class="h-16 border-b-neo border-border flex items-center px-6 bg-primary">
      <h1 class="text-2xl font-black tracking-tighter uppercase">QATrack</h1>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <div class="mb-4">
        <p class="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Workspace</p>
        <router-link 
          v-for="item in menuItems.slice(0, 2)" 
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 text-sm font-bold border-2 border-transparent hover:border-border hover:bg-background transition-colors mb-1"
          active-class="border-border bg-background shadow-neo-sm translate-x-[-2px] translate-y-[-2px]"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" :d="item.icon"></path>
          </svg>
          {{ item.name }}
        </router-link>
      </div>

      <div class="mb-4">
        <p class="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Testing</p>
        <router-link 
          v-for="item in menuItems.slice(2, 4)" 
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 text-sm font-bold border-2 border-transparent hover:border-border hover:bg-background transition-colors mb-1"
          active-class="border-border bg-background shadow-neo-sm translate-x-[-2px] translate-y-[-2px]"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" :d="item.icon"></path>
          </svg>
          {{ item.name }}
        </router-link>
      </div>
      
      <div class="mb-4">
        <p class="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quality</p>
        <router-link 
          v-for="item in menuItems.slice(4)" 
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 text-sm font-bold border-2 border-transparent hover:border-border hover:bg-background transition-colors mb-1"
          active-class="border-border bg-background shadow-neo-sm translate-x-[-2px] translate-y-[-2px]"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" :d="item.icon"></path>
          </svg>
          {{ item.name }}
        </router-link>
      </div>
    </nav>
  </aside>
</template>
