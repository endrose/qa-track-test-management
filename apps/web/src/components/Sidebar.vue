<script setup lang="ts">
import { computed } from 'vue'

const workspaceItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/' },
  { name: 'Projects', icon: 'folder', path: '/projects' },
]

const testingItems = [
  { name: 'Requirements', icon: 'fact_check', path: '/requirements' },
  { name: 'Test Scenarios', icon: 'account_tree', path: '/test-scenarios' },
  { name: 'Test Cases', icon: 'checklist', path: '/test-cases' },
  { name: 'Test Executions', icon: 'play_arrow', path: '/test-executions' },
  { name: 'Automation', icon: 'smart_toy', path: '/automation' },
]

const qualityItems = [
  { name: 'Bugs', icon: 'pest_control', path: '/bugs' },
  { name: 'Reports', icon: 'bar_chart', path: '/reports' },
  { name: 'RTM', icon: 'grid_view', path: '/rtm' },
]

const adminItems = [
  { name: 'Settings', icon: 'settings', path: '/settings' },
]

const user = computed(() => {
  try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
})
const userInitial = computed(() => (user.value?.name || user.value?.email || 'U').charAt(0).toUpperCase())
const userName = computed(() => user.value?.name || user.value?.email || 'User')
const userRole = computed(() => user.value?.role || 'Member')
</script>

<template>
  <aside class="fixed left-0 top-0 h-full w-[250px] bg-surface-container-lowest border-r-[3px] border-outline z-50 flex flex-col">
    <div class="h-16 px-gutter flex items-center border-b-[3px] border-outline bg-primary text-on-primary font-headline text-title">
      <span class="material-symbols-outlined mr-2">bug_report</span>
      QATrack
    </div>

    <div class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
      <nav class="space-y-1">
        <div class="px-3 py-1 text-label text-on-surface-variant uppercase tracking-wider">Workspace</div>
        <router-link 
          v-for="item in workspaceItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 border-[2px] border-transparent hover:border-outline text-on-surface hover:bg-surface-container transition-all"
          active-class="bg-primary text-on-primary font-bold shadow-[2px_2px_0px_#000000]"
        >
          <span class="material-symbols-outlined mr-3 text-[20px]">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </nav>

      <nav v-if="['Admin', 'QA Lead', 'Tester'].includes(userRole)" class="space-y-1">
        <div class="px-3 py-1 text-label text-on-surface-variant uppercase tracking-wider">Testing</div>
        <router-link 
          v-for="item in testingItems.filter(i => ['Admin', 'QA Lead'].includes(userRole) || i.name !== 'Automation')" 
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 border-[2px] border-transparent hover:border-outline text-on-surface hover:bg-surface-container transition-all"
          active-class="bg-primary text-on-primary font-bold shadow-[2px_2px_0px_#000000]"
        >
          <span class="material-symbols-outlined mr-3 text-[20px]">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </nav>

      <nav v-if="['Admin', 'QA Lead', 'Tester', 'Developer', 'Viewer'].includes(userRole)" class="space-y-1">
        <div class="px-3 py-1 text-label text-on-surface-variant uppercase tracking-wider">Quality</div>
        <router-link 
          v-for="item in qualityItems.filter(i => {
            if (i.name === 'Reports') return ['Admin', 'QA Lead', 'Viewer'].includes(userRole);
            if (i.name === 'Bugs') return ['Admin', 'QA Lead', 'Tester', 'Developer'].includes(userRole);
            if (i.name === 'RTM') return ['Admin', 'QA Lead', 'Tester', 'Viewer'].includes(userRole);
            return true;
          })" 
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 border-[2px] border-transparent hover:border-outline text-on-surface hover:bg-surface-container transition-all"
          active-class="bg-primary text-on-primary font-bold shadow-[2px_2px_0px_#000000]"
        >
          <span class="material-symbols-outlined mr-3 text-[20px]">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </nav>

      <nav v-if="userRole === 'Admin'" class="space-y-1">
        <div class="px-3 py-1 text-label text-on-surface-variant uppercase tracking-wider">Admin</div>
        <router-link 
          v-for="item in adminItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 border-[2px] border-transparent hover:border-outline text-on-surface hover:bg-surface-container transition-all"
          active-class="bg-primary text-on-primary font-bold shadow-[2px_2px_0px_#000000]"
        >
          <span class="material-symbols-outlined mr-3 text-[20px]">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <div class="p-3 border-t-[3px] border-outline bg-surface-container-low flex flex-col gap-2">
      <div class="flex items-center justify-between text-on-surface-variant text-label">
        <a class="hover:text-on-surface" href="#">Help</a>
        <a class="hover:text-on-surface" href="#">Docs</a>
      </div>
      <div class="flex items-center gap-3 p-2 bg-surface border-[2px] border-outline shadow-[2px_2px_0px_#000000]">
        <div class="w-8 h-8 bg-primary flex items-center justify-center text-on-primary font-bold">{{ userInitial }}</div>
        <div class="flex flex-col">
          <span class="font-bold text-body truncate max-w-[130px]">{{ userName }}</span>
          <span class="text-label text-on-surface-variant">{{ userRole }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>
