<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedProjectId = ref(localStorage.getItem('selectedProjectId') || '')

const htmlReportUrl = computed(() => {
  if (selectedProjectId.value) {
    return `http://127.0.0.1:3000/html-report/${selectedProjectId.value}/index.html`
  }
  return 'http://127.0.0.1:3000/html-report/index.html'
})

const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeError = ref(false)
const iframeLoading = ref(true)

const onIframeLoad = () => {
  iframeLoading.value = false
  iframeError.value = false
}

const onIframeError = () => {
  iframeLoading.value = false
  iframeError.value = true
}

const refreshReport = () => {
  iframeLoading.value = true
  iframeError.value = false
  if (iframeRef.value) {
    iframeRef.value.src = htmlReportUrl.value + '?t=' + Date.now()
  }
}

const openInNewTab = () => {
  window.open(htmlReportUrl.value, '_blank')
}
</script>

<template>
  <div class="h-[calc(100vh-80px)] flex flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <div class="flex flex-col gap-1">
        <span class="px-2 py-0.5 bg-[#f97316] text-white font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Playwright</span>
        <h1 class="font-display text-display text-on-surface tracking-tight uppercase">HTML Report</h1>
      </div>
      <div class="flex items-center gap-3">
        <button @click="refreshReport" class="px-3 py-2 bg-surface text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">refresh</span> Refresh
        </button>
        <button @click="openInNewTab" class="px-3 py-2 bg-[#f97316] text-white font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">open_in_new</span> Open in New Tab
        </button>
      </div>
    </div>

    <!-- Info Banner -->
    <div v-if="!selectedProjectId" class="bg-[#fef08a] text-on-surface border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex items-center gap-3">
      <span class="material-symbols-outlined text-warning">warning</span>
      <div>
        <p class="font-label uppercase text-[12px] font-bold">No Project Selected</p>
        <p class="font-body text-body text-sm mt-1">Showing root HTML report. Select a project from the top bar to view project-specific reports.</p>
      </div>
    </div>

    <!-- Iframe Container -->
    <div class="flex-1 bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] relative overflow-hidden flex flex-col">
      <div class="bg-surface-container border-b-[2px] border-outline p-2 flex items-center gap-2">
        <span class="material-symbols-outlined text-[14px] text-on-surface-variant">language</span>
        <span class="font-mono text-[10px] text-on-surface-variant truncate">
          Source: <code class="ml-1 text-on-surface">{{ htmlReportUrl }}</code>
        </span>
      </div>
      
      <!-- Loading State -->
      <div v-if="iframeLoading" class="absolute inset-0 top-[37px] flex flex-col items-center justify-center bg-surface-container-lowest z-10">
        <span class="material-symbols-outlined animate-spin text-[32px] text-primary mb-2">sync</span>
        <span class="font-label uppercase text-label">Loading HTML Report...</span>
      </div>

      <!-- Error State -->
      <div v-if="iframeError" class="absolute inset-0 top-[37px] flex flex-col items-center justify-center bg-surface-container-lowest z-10">
        <span class="material-symbols-outlined text-[48px] text-error mb-2">error</span>
        <h2 class="font-headline text-headline uppercase mb-2">Report Not Found</h2>
        <p class="font-body text-body text-center max-w-md text-on-surface-variant mb-4">
          HTML Report belum di-generate atau API backend tidak berjalan.
        </p>
        <button @click="refreshReport" class="px-4 py-2 bg-surface border-[2px] border-outline font-label uppercase text-[12px] hover:bg-surface-dim">
          Try Again
        </button>
      </div>

      <iframe 
        ref="iframeRef"
        :src="htmlReportUrl"
        class="w-full h-full border-none"
        @load="onIframeLoad"
        @error="onIframeError"
        title="Playwright HTML Report"
      ></iframe>
    </div>
  </div>
</template>
