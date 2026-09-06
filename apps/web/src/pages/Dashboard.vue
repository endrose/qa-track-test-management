<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const kpis = [
  { label: 'Test Cases', icon: 'checklist', value: '0', sub: 'Loading...', bg: 'bg-[#fde047]' },
  { label: 'Pass Rate', icon: 'trending_up', value: '86%', sub: '+2.4%', bg: 'bg-[#86efac]' },
  { label: 'Automation', icon: 'smart_toy', value: '64%', sub: 'Target: 70%', bg: 'bg-[#93c5fd]' },
  { label: 'Open Bugs', icon: 'pest_control', value: '0', sub: 'Loading...', bg: 'bg-[#fdba74]' },
  { label: 'Critical Bugs', icon: 'warning', value: '0', sub: 'Blocker', bg: 'bg-[#ef4444]', text: 'text-white' },
  { label: 'Blocked', icon: 'block', value: '0', sub: 'Env issues', bg: 'bg-surface-container-highest' },
]

const recentRuns = ref([
  { id: '#RUN-8942', type: 'Regression', env: 'Staging-US', browser: 'Chrome 122', passed: 342, failed: 0, duration: '14m 22s', status: 'Passed', statusBg: 'bg-[#86efac]' },
  { id: '#RUN-8941', type: 'Smoke', env: 'Production', browser: 'Safari 17', passed: 45, failed: 3, duration: '2m 10s', status: 'Failed', statusBg: 'bg-[#ef4444] text-white' },
  { id: '#RUN-8940', type: 'Integration', env: 'Staging-EU', browser: 'Firefox 123', passed: 189, failed: 12, duration: '8m 45s', status: 'Failed', statusBg: 'bg-[#ef4444] text-white' },
  { id: '#RUN-8939', type: 'Regression', env: 'QA-Asia', browser: 'Edge 121', passed: 210, failed: 0, duration: '10m 5s', status: 'Passed', statusBg: 'bg-[#86efac]' },
  { id: '#RUN-8938', type: 'Smoke', env: 'Dev', browser: 'Chrome 121', passed: 40, failed: 0, duration: '1m 55s', status: 'Passed', statusBg: 'bg-[#86efac]' },
])

// Filter state for Recent Test Runs
const searchRun = ref('')
const filterType = ref('')
const filterStatus = ref('')

const filteredRuns = computed(() =>
  recentRuns.value.filter(r => {
    const q = searchRun.value.toLowerCase()
    const matchSearch = !q || r.id.toLowerCase().includes(q) || r.env.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)
    const matchType = !filterType.value || r.type === filterType.value
    const matchStatus = !filterStatus.value || r.status === filterStatus.value
    return matchSearch && matchType && matchStatus
  })
)

const runTypes = ['Regression', 'Smoke', 'Integration']

// KPI real data
const token = localStorage.getItem('token') || ''
const dynamicKpis = ref({ testCases: 0, openBugs: 0, criticalBugs: 0, projects: 0, requirements: 0, coverage: 0 })

onMounted(async () => {
  try {
    const [tcRes, bugsRes, reqRes] = await Promise.all([
      fetch('http://localhost:3000/api/test-cases', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('http://localhost:3000/api/bugs', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('http://localhost:3000/api/requirements', { headers: { Authorization: `Bearer ${token}` } }),
    ])
    if (tcRes.ok) {
      const tc = await tcRes.json()
      dynamicKpis.value.testCases = tc.length
      kpis[0].value = tc.length.toString()
      kpis[0].sub = `Total test cases`
    }
    if (bugsRes.ok) {
      const bugs = await bugsRes.json()
      const open = bugs.filter((b: any) => b.status !== 'Closed' && b.status !== 'Resolved')
      const critical = open.filter((b: any) => b.severity === 'Critical' || b.priority === 'Critical')
      kpis[3].value = open.length.toString()
      kpis[3].sub = `${open.length} open`
      kpis[4].value = critical.length.toString()
    }
    if (reqRes.ok) {
      const reqs = await reqRes.json()
      kpis[5].value = reqs.length.toString()
      kpis[5].sub = `Requirements`
    }
  } catch {
    // fallback to static
  }
})

// Action handlers
const goToTestCases = () => router.push('/test-cases')
const goToBugs = () => router.push('/bugs')
const goToTestExecutions = () => router.push('/test-executions')
const goToRTM = () => router.push('/rtm')
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline">Dashboard v4.2</span>
        <span class="text-on-surface-variant font-body text-body">E-Commerce Platform / QA Environment</span>
      </div>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">QUALITY DASHBOARD</h1>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <button
        @click="goToTestExecutions"
        class="px-4 py-2 bg-[#fde047] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">play_arrow</span> Run Tests
      </button>
      <button
        @click="goToTestCases"
        class="px-4 py-2 bg-[#86efac] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">add_task</span> Create Test Case
      </button>
      <button
        @click="goToBugs"
        class="px-4 py-2 bg-[#fca5a5] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">bug_report</span> Create Bug
      </button>
    </div>
  </div>

  <!-- KPI Blocks Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
    <div v-for="kpi in kpis" :key="kpi.label" :class="[kpi.bg, kpi.text || 'text-on-surface']" class="border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <div class="flex items-center justify-between mb-2">
        <span class="font-label uppercase text-label">{{ kpi.label }}</span>
        <span class="material-symbols-outlined text-[20px]">{{ kpi.icon }}</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="font-display text-display font-black">{{ kpi.value }}</span>
        <span class="font-label text-[10px] px-1 bg-surface text-on-surface border border-outline">{{ kpi.sub }}</span>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
    <div class="lg:col-span-2 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <div class="flex items-center justify-between mb-4 pb-2 border-b-[2px] border-outline">
        <h2 class="font-headline text-headline uppercase flex items-center gap-2">
          <span class="material-symbols-outlined">bar_chart</span> Test Execution Breakdown
        </h2>
        <span class="font-label text-label uppercase px-2 py-1 bg-surface border-[2px] border-outline">Last 24 Hours</span>
      </div>
      <div class="space-y-4 my-2">
        <div class="flex flex-col gap-1">
          <div class="flex justify-between font-label text-label">
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-[#86efac] border-[2px] border-outline inline-block"></span> PASSED (837)</span>
            <span>85.9%</span>
          </div>
          <div class="w-full h-6 bg-surface border-[2px] border-outline p-0.5">
            <div class="h-full bg-[#86efac] border-r-[2px] border-outline" style="width: 85.9%;"></div>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex justify-between font-label text-label">
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-[#ef4444] border-[2px] border-outline inline-block"></span> FAILED (84)</span>
            <span>8.6%</span>
          </div>
          <div class="w-full h-6 bg-surface border-[2px] border-outline p-0.5">
            <div class="h-full bg-[#ef4444] border-r-[2px] border-outline" style="width: 8.6%;"></div>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex justify-between font-label text-label">
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-[#fde047] border-[2px] border-outline inline-block"></span> SKIPPED (52)</span>
            <span>5.3%</span>
          </div>
          <div class="w-full h-6 bg-surface border-[2px] border-outline p-0.5">
            <div class="h-full bg-[#fde047] border-r-[2px] border-outline" style="width: 5.3%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- RTM Coverage -->
    <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-4 pb-2 border-b-[2px] border-outline">
          <h2 class="font-headline text-headline uppercase flex items-center gap-2">
            <span class="material-symbols-outlined">fact_check</span> RTM Coverage
          </h2>
          <span class="font-label text-label uppercase px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed border-[2px] border-outline">Active</span>
        </div>
        <div class="flex flex-col items-center justify-center py-4 bg-surface border-[2px] border-outline mb-4">
          <span class="font-display text-[48px] font-black tracking-tighter">92%</span>
          <span class="font-label uppercase text-label text-on-surface-variant">Requirement Coverage</span>
        </div>
      </div>
      <button
        @click="goToRTM"
        class="w-full py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all mt-4"
      >
        View Traceability Matrix
      </button>
    </div>
  </div>

  <!-- Recent Test Runs with Search & Filter -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-2 border-b-[2px] border-outline">
      <h2 class="font-headline text-headline uppercase flex items-center gap-2">
        <span class="material-symbols-outlined">history</span> Recent Test Runs
      </h2>
      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-surface border-[2px] border-outline shadow-[2px_2px_0px_#000000]">
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant">search</span>
          <input
            v-model="searchRun"
            type="text"
            placeholder="Search runs..."
            class="bg-transparent outline-none text-body w-32"
          />
        </div>
        <select
          v-model="filterType"
          class="px-3 py-1.5 bg-surface border-[2px] border-outline font-label text-body outline-none shadow-[2px_2px_0px_#000000]"
        >
          <option value="">All Types</option>
          <option v-for="t in runTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <select
          v-model="filterStatus"
          class="px-3 py-1.5 bg-surface border-[2px] border-outline font-label text-body outline-none shadow-[2px_2px_0px_#000000]"
        >
          <option value="">All Status</option>
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
        </select>
        <span class="font-label text-[10px] uppercase text-on-surface-variant">{{ filteredRuns.length }} runs</span>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">Run ID</th>
            <th class="p-3 border-r-[2px] border-outline">Type</th>
            <th class="p-3 border-r-[2px] border-outline">Environment</th>
            <th class="p-3 border-r-[2px] border-outline">Passed</th>
            <th class="p-3 border-r-[2px] border-outline">Failed</th>
            <th class="p-3 border-r-[2px] border-outline">Duration</th>
            <th class="p-3">Status</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-for="run in filteredRuns" :key="run.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ run.id }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ run.type }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ run.env }}</td>
            <td class="p-3 border-r-[2px] border-outline text-[#15803d] font-bold">{{ run.passed }}</td>
            <td class="p-3 border-r-[2px] border-outline text-error font-bold">{{ run.failed }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ run.duration }}</td>
            <td class="p-3"><span :class="run.statusBg" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ run.status }}</span></td>
          </tr>
          <tr v-if="filteredRuns.length === 0">
            <td colspan="7" class="p-6 text-center font-label uppercase text-on-surface-variant">No runs match your filter</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
