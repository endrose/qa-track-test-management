<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const reports = ref<any[]>([])
const projects = ref<any[]>([])
const testCases = ref<any[]>([])
const isGenerating = ref(false)
const selectedProjectId = ref('')

const fetchReports = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/reports')
    if (res.ok) {
      reports.value = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch reports', error)
  }
}

const fetchProjects = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/projects')
    if (res.ok) projects.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch projects', err)
  }
}

const fetchTestCases = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/test-cases')
    if (res.ok) testCases.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch test cases', err)
  }
}

const generateReport = async () => {
  isGenerating.value = true
  try {
    const reportName = `Snapshot - ${new Date().toLocaleString()}`
    const res = await fetch('http://127.0.0.1:3000/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: reportName,
        project: selectedProjectId.value ? { id: selectedProjectId.value } : null
      })
    })
    if (res.ok) {
      await fetchReports()
    }
  } catch (error) {
    console.error('Failed to generate report', error)
  } finally {
    isGenerating.value = false
  }
}

// Live stats from current test cases
const filteredTestCases = computed(() => {
  if (!selectedProjectId.value) return testCases.value
  return testCases.value.filter((tc: any) => tc.project?.id === selectedProjectId.value)
})

const livePassed = computed(() => filteredTestCases.value.filter((tc: any) => tc.status === 'Passed').length)
const liveFailed = computed(() => filteredTestCases.value.filter((tc: any) => tc.status === 'Failed').length)
const liveReady = computed(() => filteredTestCases.value.filter((tc: any) => tc.status === 'Ready').length)
const liveDraft = computed(() => filteredTestCases.value.filter((tc: any) => tc.status === 'Draft').length)
const liveTotal = computed(() => filteredTestCases.value.length)
const livePassRate = computed(() => liveTotal.value === 0 ? 0 : Math.round((livePassed.value / liveTotal.value) * 100))

onMounted(() => {
  fetchReports()
  fetchProjects()
  fetchTestCases()
})
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000] mb-4">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Analytics</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Test Reports</h1>
    </div>
    <div class="flex items-center gap-3">
      <select v-model="selectedProjectId" @change="fetchTestCases" class="px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000] text-sm">
        <option value="">All Projects</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <button 
        @click="generateReport" 
        :disabled="isGenerating"
        class="px-4 py-2 bg-[#93c5fd] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined text-[18px]">add_chart</span> 
        {{ isGenerating ? 'Generating...' : 'Generate Snapshot' }}
      </button>
    </div>
  </div>

  <!-- Live Stats from Test Cases -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000] mb-4">
    <h2 class="font-headline text-headline uppercase flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
      <span class="material-symbols-outlined">assignment</span>
      Live Test Case Status
      <span class="ml-2 text-[10px] font-label font-normal text-on-surface-variant border-[2px] border-outline px-2 py-0.5">{{ selectedProjectId ? projects.find(p => p.id === selectedProjectId)?.name : 'All Projects' }}</span>
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
      <div class="bg-[#86efac] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Passed</span>
        <span class="font-display text-display font-black">{{ livePassed }}</span>
      </div>
      <div class="bg-[#fca5a5] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Failed</span>
        <span class="font-display text-display font-black">{{ liveFailed }}</span>
      </div>
      <div class="bg-[#93c5fd] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Ready</span>
        <span class="font-display text-display font-black">{{ liveReady }}</span>
      </div>
      <div class="bg-surface border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Draft</span>
        <span class="font-display text-display font-black">{{ liveDraft }}</span>
      </div>
      <div class="bg-[#fde047] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Pass Rate</span>
        <span class="font-display text-display font-black">{{ livePassRate }}%</span>
      </div>
    </div>
    <!-- Progress Bar -->
    <div class="flex h-4 border-[2px] border-outline overflow-hidden mt-3" v-if="liveTotal > 0">
      <div class="bg-[#86efac] transition-all" :style="{ width: (livePassed/liveTotal*100) + '%' }" :title="`Passed: ${livePassed}`"></div>
      <div class="bg-[#fca5a5] transition-all" :style="{ width: (liveFailed/liveTotal*100) + '%' }" :title="`Failed: ${liveFailed}`"></div>
      <div class="bg-[#93c5fd] transition-all" :style="{ width: (liveReady/liveTotal*100) + '%' }" :title="`Ready: ${liveReady}`"></div>
      <div class="bg-surface-dim flex-1" :title="`Draft: ${liveDraft}`"></div>
    </div>
    <div class="flex gap-4 mt-2" v-if="liveTotal > 0">
      <span class="font-label text-[9px] uppercase flex items-center gap-1"><span class="w-3 h-3 bg-[#86efac] border border-outline inline-block"></span>Passed</span>
      <span class="font-label text-[9px] uppercase flex items-center gap-1"><span class="w-3 h-3 bg-[#fca5a5] border border-outline inline-block"></span>Failed</span>
      <span class="font-label text-[9px] uppercase flex items-center gap-1"><span class="w-3 h-3 bg-[#93c5fd] border border-outline inline-block"></span>Ready</span>
      <span class="font-label text-[9px] uppercase flex items-center gap-1"><span class="w-3 h-3 bg-surface-dim border border-outline inline-block"></span>Draft</span>
    </div>
    <div v-else class="text-center font-label uppercase text-[10px] text-on-surface-variant py-4">No test cases found for selected filter.</div>
  </div>

  <!-- Report History -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <h2 class="font-headline text-headline uppercase flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
      <span class="material-symbols-outlined">history</span> Report Snapshots
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">Report Name</th>
            <th class="p-3 border-r-[2px] border-outline">Project</th>
            <th class="p-3 border-r-[2px] border-outline">Summary</th>
            <th class="p-3 border-r-[2px] border-outline">Passed</th>
            <th class="p-3 border-r-[2px] border-outline">Failed</th>
            <th class="p-3 border-r-[2px] border-outline">Not Run</th>
            <th class="p-3">Created At</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="reports.length === 0">
            <td colspan="7" class="p-6 text-center font-label uppercase text-on-surface-variant">No snapshots yet. Click "Generate Snapshot" to save the current state.</td>
          </tr>
          <tr v-for="report in reports" :key="report.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ report.name }}</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span v-if="report.project" class="px-2 py-0.5 bg-[#93c5fd] border-[2px] border-outline font-label uppercase text-[10px]">{{ report.project.name }}</span>
              <span v-else class="text-on-surface-variant text-[10px]">All Projects</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline text-label text-on-surface-variant">{{ report.summary || '-' }}</td>
            <td class="p-3 border-r-[2px] border-outline text-[#15803d] font-bold">{{ report.passed }}</td>
            <td class="p-3 border-r-[2px] border-outline text-error font-bold">{{ report.failed }}</td>
            <td class="p-3 border-r-[2px] border-outline text-on-surface-variant">{{ report.skipped }}</td>
            <td class="p-3">{{ new Date(report.createdAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
