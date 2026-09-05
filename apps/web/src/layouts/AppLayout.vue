<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import TopBar from '../components/TopBar.vue'
</script>

<template>
  <div class="flex h-screen w-full bg-background overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar />
      
      <!-- Scrollable Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
