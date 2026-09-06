<script setup lang="ts">
import { ref, onMounted } from 'vue'

const reports = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/reports')
    if (res.ok) {
      reports.value = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch reports', error)
  }
})
</script>

<template>
  <div class="flex flex-col gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Reports</h1>
    </div>
  </div>

  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">ID</th>
            <th class="p-3 border-r-[2px] border-outline">Name</th>
            <th class="p-3 border-r-[2px] border-outline">Passed</th>
            <th class="p-3 border-r-[2px] border-outline">Failed</th>
            <th class="p-3">Created At</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="reports.length === 0">
            <td colspan="5" class="p-3 text-center">No reports found.</td>
          </tr>
          <tr v-for="report in reports" :key="report.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ report.id }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ report.name }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ report.passed }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ report.failed }}</td>
            <td class="p-3">{{ new Date(report.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
