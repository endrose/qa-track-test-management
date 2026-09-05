<script setup lang="ts">
</script>

<template>
  <header class="h-16 border-b-neo border-border bg-surface flex items-center justify-between px-6 shrink-0">
    <div class="flex items-center gap-4">
      <div class="font-bold border-neo border-border px-3 py-1 bg-background text-sm">
        Project: E-Commerce Platform
      </div>
      <div class="font-bold border-neo border-border px-3 py-1 bg-accent text-sm">
        Env: QA
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative">
        <input 
          type="text" 
          placeholder="Search... (Ctrl+K)" 
          class="input-neo w-64 text-sm font-medium"
        />
        <svg class="w-4 h-4 absolute right-3 top-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <button class="btn-neo p-2 bg-secondary text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </button>
      <div class="w-10 h-10 border-neo border-border bg-primary rounded-full shadow-neo flex items-center justify-center font-black">
        ST
      </div>
    </div>
  </header>
</template>
