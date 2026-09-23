<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import TopBar from '../components/TopBar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="bg-surface font-body text-on-surface min-h-screen">
    <!-- Sidebar -->
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main content: shifted right on desktop, full width on mobile -->
    <div class="lg:pl-[250px] transition-all duration-300">
      <TopBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="relative pt-16 bg-surface min-h-screen p-4 md:p-margin">
        <div class="flex flex-col w-full gap-gutter">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
