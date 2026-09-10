<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

const isLoading = ref(true)
const hasError = ref(false)
const projects = ref<any[]>([])
const selectedProjectId = ref('')

const allureUrl = computed(() => {
  if (selectedProjectId.value) {
    return `http://localhost:3000/allure/${selectedProjectId.value}/index.html`
  }
  return 'http://localhost:3000/allure/index.html'
})

const iframeRef = ref<HTMLIFrameElement | null>(null)

const fetchProjects = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/projects')
    if (res.ok) projects.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch projects', err)
  }
}

watch(selectedProjectId, () => {
  refresh()
})

onMounted(() => {
  fetchProjects()
})

const handleLoad = () => {
  isLoading.value = false
}

const handleError = () => {
  isLoading.value = false
  hasError.value = true
}

const refresh = () => {
  isLoading.value = true
  hasError.value = false
  if (iframeRef.value) {
    iframeRef.value.src = allureUrl.value + '?t=' + Date.now()
  }
}

const openExternal = () => {
  window.open(allureUrl.value, '_blank')
}
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-[#a78bfa] text-white font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Allure</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Allure Report</h1>
    </div>
    <div class="flex items-center gap-3">
      <select v-model="selectedProjectId" class="px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000] text-sm max-w-[200px]">
        <option value="">Default (Global)</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <button
        @click="refresh"
        class="px-4 py-2 bg-surface-container text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">refresh</span> Refresh
      </button>
      <button
        @click="openExternal"
        class="px-4 py-2 bg-[#a78bfa] text-white font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">open_in_new</span> Open Full
      </button>
    </div>
  </div>

  <!-- Info bar -->
  <div class="flex items-center gap-4 bg-surface-container border-[2px] border-outline px-4 py-2 text-label font-label text-on-surface-variant">
    <span class="flex items-center gap-1">
      <span class="material-symbols-outlined text-[14px]">link</span>
      Source: <code class="ml-1 text-on-surface">{{ allureUrl }}</code>
    </span>
    <span class="flex items-center gap-1 text-[#15803d]">
      <span class="material-symbols-outlined text-[14px]">circle</span>
      Live
    </span>
  </div>

  <!-- Loading state -->
  <div
    v-if="isLoading"
    class="bg-surface-container-lowest border-[3px] border-outline flex-1 flex items-center justify-center min-h-[500px] shadow-[4px_4px_0px_#000000]"
  >
    <div class="flex flex-col items-center gap-4 text-on-surface-variant">
      <span class="material-symbols-outlined text-[48px] animate-spin" style="animation: spin 1.2s linear infinite">bar_chart_4_bars</span>
      <span class="font-label uppercase text-label">Loading Allure Report...</span>
    </div>
  </div>

  <!-- Error state -->
  <div
    v-if="hasError && !isLoading"
    class="bg-surface-container-lowest border-[3px] border-outline flex-1 flex items-center justify-center min-h-[500px] shadow-[4px_4px_0px_#000000]"
  >
    <div class="flex flex-col items-center gap-4 text-center max-w-md p-8">
      <span class="material-symbols-outlined text-[48px] text-error">error</span>
      <h2 class="font-headline text-headline uppercase">Report Tidak Tersedia</h2>
      <p class="font-body text-on-surface-variant">
        Allure Report belum di-generate atau API backend tidak berjalan.
        Pastikan backend berjalan dan setidaknya satu automation run telah selesai.
      </p>
      <button @click="refresh" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">refresh</span> Coba Lagi
      </button>
    </div>
  </div>

  <!-- Iframe container -->
  <div
    v-show="!isLoading && !hasError"
    class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] overflow-hidden"
    style="height: calc(100vh - 230px); min-height: 500px;"
  >
    <iframe
      ref="iframeRef"
      :src="allureUrl"
      class="w-full h-full border-none"
      @load="handleLoad"
      @error="handleError"
      title="Allure Test Report"
      allow="same-origin"
    />
  </div>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
