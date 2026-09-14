<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const reports = ref<any[]>([])
const projects = ref<any[]>([])
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

const generateReport = async () => {
  isGenerating.value = true
  try {
    const reportName = `Snapshot - ${new Date().toLocaleDateString()}`
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

const totalPassed = computed(() => reports.value.reduce((acc, r) => acc + (r.passed || 0), 0))
const totalFailed = computed(() => reports.value.reduce((acc, r) => acc + (r.failed || 0), 0))
const totalTests = computed(() => totalPassed.value + totalFailed.value)
const passRate = computed(() => totalTests.value === 0 ? 0 : Math.round((totalPassed.value / totalTests.value) * 100))

onMounted(() => {
  fetchReports()
  fetchProjects()
})
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000] mb-4">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Analytics</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Test Reports</h1>
    </div>
    <div class="flex items-center gap-3">
      <select v-model="selectedProjectId" class="px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000] text-sm">
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

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div class="bg-[#86efac] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <span class="font-label uppercase text-label">Total Passed (All Time)</span>
      <span class="font-display text-display font-black">{{ totalPassed }}</span>
    </div>
    <div class="bg-[#ef4444] text-white border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <span class="font-label uppercase text-label">Total Failed (All Time)</span>
      <span class="font-display text-display font-black">{{ totalFailed }}</span>
    </div>
    <div class="bg-[#fde047] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <span class="font-label uppercase text-label">Overall Pass Rate</span>
      <span class="font-display text-display font-black">{{ passRate }}%</span>
    </div>
  </div>

  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <h2 class="font-headline text-headline uppercase flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
      <span class="material-symbols-outlined">history</span> Report History
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
            <th class="p-3">Created At</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="reports.length === 0">
            <td colspan="5" class="p-6 text-center font-label uppercase text-on-surface-variant">No reports found. Generate one above.</td>
          </tr>
          <tr v-for="report in reports" :key="report.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ report.name }}</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span v-if="report.project" class="px-2 py-0.5 bg-[#93c5fd] border-[2px] border-outline font-label uppercase text-[10px]">{{ report.project.name }}</span>
              <span v-else class="text-on-surface-variant text-[10px]">—</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline text-label">{{ report.summary || '-' }}</td>
            <td class="p-3 border-r-[2px] border-outline text-[#15803d] font-bold">{{ report.passed }}</td>
            <td class="p-3 border-r-[2px] border-outline text-error font-bold">{{ report.failed }}</td>
            <td class="p-3">{{ new Date(report.createdAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
