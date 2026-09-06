<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import TopBar from '../components/TopBar.vue'
</script>

<template>
  <div class="bg-surface font-body text-on-surface min-h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <div class="pl-[250px]">
      <TopBar />
      
      <main class="relative pt-16 bg-surface min-h-screen p-margin">
        <div class="flex flex-col w-full gap-gutter">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
