<script setup lang="ts">
const stats = [
  { label: 'Total Test Cases', value: '1,248', color: 'bg-surface' },
  { label: 'Pass Rate', value: '94.2%', color: 'bg-accent' },
  { label: 'Automation Coverage', value: '68%', color: 'bg-primary' },
  { label: 'Open Bugs', value: '24', color: 'bg-danger text-white' },
]

const recentRuns = [
  { id: 'RUN-402', status: 'Passed', duration: '4m 12s', env: 'QA', time: '10 mins ago' },
  { id: 'RUN-401', status: 'Failed', duration: '5m 01s', env: 'Staging', time: '2 hours ago' },
  { id: 'RUN-400', status: 'Passed', duration: '3m 45s', env: 'QA', time: '4 hours ago' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-black uppercase tracking-tight">Dashboard</h2>
      <button class="btn-neo-primary">Run Suite</button>
    </div>

    <!-- KPI Blocks -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="card-neo flex flex-col" :class="stat.color">
        <span class="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">{{ stat.label }}</span>
        <span class="text-4xl font-black">{{ stat.value }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chart Placeholder -->
      <div class="card-neo lg:col-span-2">
        <h3 class="text-xl font-black uppercase border-b-neo border-border pb-2 mb-4">Test Execution Trend</h3>
        <div class="h-64 bg-background border-2 border-dashed border-border flex items-center justify-center font-bold text-gray-500">
          [ Execution Chart Component ]
        </div>
      </div>

      <!-- Recent Runs -->
      <div class="card-neo">
        <h3 class="text-xl font-black uppercase border-b-neo border-border pb-2 mb-4">Recent Runs</h3>
        <div class="space-y-3">
          <div v-for="run in recentRuns" :key="run.id" class="border-2 border-border p-3 flex justify-between items-center bg-background hover:bg-surface transition-colors cursor-pointer">
            <div>
              <div class="font-bold">{{ run.id }}</div>
              <div class="text-xs font-medium text-gray-600">{{ run.env }} • {{ run.time }}</div>
            </div>
            <div class="text-right">
              <span class="badge-neo" :class="run.status === 'Passed' ? 'bg-accent' : 'bg-danger text-white'">
                {{ run.status }}
              </span>
              <div class="text-xs font-bold mt-1">{{ run.duration }}</div>
            </div>
          </div>
        </div>
        <button class="btn-neo w-full mt-4 text-sm">View All Runs</button>
      </div>
    </div>
  </div>
</template>
