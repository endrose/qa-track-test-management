<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const selectedProjectId = ref(localStorage.getItem('selectedProjectId') || '')
const jmeterResults = ref<string[]>([])
const currentJmeterData = ref<any[]>([])
const currentJmeterFile = ref('')
const isLoading = ref(false)

const fetchJmeterResults = async () => {
  try {
    const url = selectedProjectId.value 
      ? `http://127.0.0.1:3000/api/automation/jmeter-results?projectId=${selectedProjectId.value}`
      : 'http://127.0.0.1:3000/api/automation/jmeter-results'
    const res = await fetch(url)
    if (res.ok) {
      jmeterResults.value = await res.json()
      if (jmeterResults.value.length > 0 && !currentJmeterFile.value) {
        viewJmeterReport(jmeterResults.value[0])
      } else if (jmeterResults.value.length === 0) {
        currentJmeterData.value = []
        currentJmeterFile.value = ''
      }
    }
  } catch (err) {
    console.error('Failed to fetch jmeter results', err)
  }
}

const viewJmeterReport = async (filename: string) => {
  try {
    isLoading.value = true
    const url = selectedProjectId.value
      ? `http://127.0.0.1:3000/api/automation/jmeter-results/${filename}?projectId=${selectedProjectId.value}`
      : `http://127.0.0.1:3000/api/automation/jmeter-results/${filename}`
    const res = await fetch(url)
    if (res.ok) {
      currentJmeterData.value = await res.json()
      currentJmeterFile.value = filename
    }
  } catch (err) {
    console.error('Failed to fetch jmeter report details', err)
  } finally {
    isLoading.value = false
  }
}

// Custom event listener for project switch
onMounted(() => {
  fetchJmeterResults()
  
  window.addEventListener('project-switched', (e: any) => {
    selectedProjectId.value = e.detail || ''
    currentJmeterFile.value = '' // reset selection
    fetchJmeterResults()
  })
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <div class="flex flex-col gap-1">
        <span class="px-2 py-0.5 bg-[#d946ef] text-white font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">JMeter</span>
        <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Performance Report</h1>
      </div>
      <div class="flex items-center gap-3">
        <button @click="fetchJmeterResults" class="px-3 py-2 bg-surface text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">refresh</span> Refresh
        </button>
      </div>
    </div>

    <!-- Info Banner -->
    <div v-if="!selectedProjectId" class="bg-[#fef08a] text-on-surface border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex items-center gap-3">
      <span class="material-symbols-outlined text-warning">warning</span>
      <div>
        <p class="font-label uppercase text-[12px] font-bold">No Project Selected</p>
        <p class="font-body text-body text-sm mt-1">Showing root JMeter reports. Select a project from the top bar to view project-specific reports.</p>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 items-start">
      <!-- File List -->
      <div class="w-full md:w-1/4 bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] flex flex-col">
        <div class="bg-primary text-on-primary font-label uppercase p-3 border-b-[2px] border-outline">
          Report Files (.jtl)
        </div>
        <div class="max-h-[70vh] overflow-y-auto p-2 flex flex-col gap-2">
          <div v-if="jmeterResults.length === 0" class="text-on-surface-variant text-[12px] p-2 text-center">
            No JMeter reports found.
          </div>
          <button
            v-for="file in jmeterResults"
            :key="file"
            @click="viewJmeterReport(file)"
            :class="currentJmeterFile === file ? 'bg-[#d946ef] text-white border-transparent' : 'bg-surface text-on-surface hover:bg-surface-container-highest border-outline'"
            class="p-2 border-[2px] text-left font-mono text-[11px] truncate transition-colors"
          >
            {{ file }}
          </button>
        </div>
      </div>

      <!-- Detail View -->
      <div class="w-full md:w-3/4 bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] flex flex-col">
        <div class="bg-surface-container border-b-[2px] border-outline p-3 flex justify-between items-center">
          <h2 class="font-headline text-headline uppercase flex items-center gap-2">
            <span class="material-symbols-outlined">speed</span> Report Detail
          </h2>
          <span v-if="currentJmeterFile" class="font-mono text-[10px] bg-surface px-2 py-1 border-[2px] border-outline">{{ currentJmeterFile }}</span>
        </div>
        
        <div class="relative overflow-x-auto min-h-[50vh] max-h-[70vh]">
          <div v-if="isLoading" class="absolute inset-0 bg-surface-container-lowest/50 flex flex-col items-center justify-center z-10">
            <span class="material-symbols-outlined animate-spin text-[32px] text-primary mb-2">sync</span>
            <span class="font-label uppercase text-label">Parsing JTL...</span>
          </div>

          <div v-else-if="currentJmeterData.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-on-surface-variant">
            <span class="material-symbols-outlined text-[48px] mb-2 opacity-50">data_array</span>
            <span class="font-label uppercase">{{ currentJmeterFile ? 'Report is empty (execution failed or no data)' : 'Select a report to view details' }}</span>
          </div>

          <table v-else class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-surface-container shadow-sm z-0">
              <tr class="font-label uppercase text-[10px] tracking-wider text-on-surface">
                <th class="p-2 border-b-[2px] border-outline border-r-[1px]">Time</th>
                <th class="p-2 border-b-[2px] border-outline border-r-[1px]">Label</th>
                <th class="p-2 border-b-[2px] border-outline border-r-[1px]">Code</th>
                <th class="p-2 border-b-[2px] border-outline border-r-[1px]">Message</th>
                <th class="p-2 border-b-[2px] border-outline border-r-[1px]">Thread Name</th>
                <th class="p-2 border-b-[2px] border-outline border-r-[1px]">Success</th>
                <th class="p-2 border-b-[2px] border-outline border-r-[1px]">Bytes</th>
                <th class="p-2 border-b-[2px] border-outline">Latency (ms)</th>
              </tr>
            </thead>
            <tbody class="font-body text-[12px] divide-y-[1px] divide-outline bg-surface">
              <tr v-for="(row, idx) in currentJmeterData" :key="idx" class="hover:bg-surface-container-highest transition-colors">
                <td class="p-2 border-r-[1px] border-outline">{{ new Date(Number(row.timeStamp)).toLocaleString() }}</td>
                <td class="p-2 border-r-[1px] border-outline">{{ row.label }}</td>
                <td class="p-2 border-r-[1px] border-outline">
                  <span :class="row.responseCode === '200' ? 'text-green-600 font-bold' : 'text-error font-bold'">{{ row.responseCode }}</span>
                </td>
                <td class="p-2 border-r-[1px] border-outline truncate max-w-[150px]" :title="row.responseMessage">{{ row.responseMessage }}</td>
                <td class="p-2 border-r-[1px] border-outline text-[10px]">{{ row.threadName }}</td>
                <td class="p-2 border-r-[1px] border-outline font-bold" :class="row.success === 'true' ? 'text-green-600' : 'text-error'">{{ row.success }}</td>
                <td class="p-2 border-r-[1px] border-outline">{{ row.bytes }}</td>
                <td class="p-2">{{ row.Latency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
