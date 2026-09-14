<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Requirement {
  id: number
  title: string
  status: string
}
interface TestCase {
  id: number
  title: string
  status: string
  requirementId?: number
}

const requirements = ref<Requirement[]>([])
const testCases = ref<TestCase[]>([])
const searchQuery = ref('')
const filterCoverage = ref('')
const loading = ref(false)
const token = localStorage.getItem('token') || ''

onMounted(async () => {
  loading.value = true
  try {
    const [reqRes, tcRes] = await Promise.all([
      fetch('http://127.0.0.1:3000/api/requirements', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('http://127.0.0.1:3000/api/test-cases', { headers: { Authorization: `Bearer ${token}` } })
    ])
    if (reqRes.ok) requirements.value = await reqRes.json()
    if (tcRes.ok) testCases.value = await tcRes.json()
  } finally {
    loading.value = false
  }
})

const getCoveredCases = (reqId: number) =>
  testCases.value.filter(tc => tc.requirementId === reqId)

const getCoverageStatus = (reqId: number) => {
  const cases = getCoveredCases(reqId)
  if (cases.length === 0) return 'Not Covered'
  const passed = cases.filter(tc => tc.status === 'Passed').length
  if (passed === cases.length) return 'Fully Covered'
  return 'Partially Covered'
}

const coverageColor: Record<string, string> = {
  'Not Covered': 'bg-[#ef4444] text-white',
  'Partially Covered': 'bg-[#fde047]',
  'Fully Covered': 'bg-[#86efac]'
}

const filteredReqs = computed(() =>
  requirements.value.filter(r => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q || r.title.toLowerCase().includes(q)
    const status = getCoverageStatus(r.id)
    const matchCoverage = !filterCoverage.value || status === filterCoverage.value
    return matchSearch && matchCoverage
  })
)

const totalCovered = computed(() =>
  requirements.value.filter(r => getCoverageStatus(r.id) !== 'Not Covered').length
)
const coveragePercent = computed(() =>
  requirements.value.length ? Math.round((totalCovered.value / requirements.value.length) * 100) : 0
)
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline">Quality</span>
      </div>
      <h1 class="font-display text-display uppercase tracking-tight">Requirements Traceability Matrix</h1>
    </div>
    <div class="flex items-center gap-3">
      <div class="px-4 py-2 bg-[#86efac] border-[2px] border-outline shadow-[3px_3px_0px_#000000] text-center">
        <div class="font-display text-display font-black leading-none">{{ coveragePercent }}%</div>
        <div class="font-label text-[10px] uppercase">Coverage</div>
      </div>
    </div>
  </div>

  <!-- Stats Bar -->
  <div class="grid grid-cols-3 gap-4">
    <div class="bg-surface-container-lowest border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] text-center">
      <div class="font-display text-display font-black text-on-surface">{{ requirements.length }}</div>
      <div class="font-label text-[10px] uppercase text-on-surface-variant">Total Requirements</div>
    </div>
    <div class="bg-[#86efac] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] text-center">
      <div class="font-display text-display font-black">{{ totalCovered }}</div>
      <div class="font-label text-[10px] uppercase">Covered</div>
    </div>
    <div class="bg-[#fca5a5] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] text-center">
      <div class="font-display text-display font-black">{{ requirements.length - totalCovered }}</div>
      <div class="font-label text-[10px] uppercase">Not Covered</div>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-wrap gap-3 items-center">
    <div class="flex items-center gap-2 px-3 py-2 bg-surface border-[2px] border-outline flex-1 min-w-[200px]">
      <span class="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
      <input v-model="searchQuery" type="text" placeholder="Search requirements..." class="flex-1 bg-transparent outline-none text-body" />
    </div>
    <select v-model="filterCoverage" class="px-3 py-2 bg-surface border-[2px] border-outline font-label text-body outline-none shadow-[2px_2px_0px_#000000]">
      <option value="">All Coverage</option>
      <option value="Not Covered">Not Covered</option>
      <option value="Partially Covered">Partially Covered</option>
      <option value="Fully Covered">Fully Covered</option>
    </select>
  </div>

  <!-- RTM Table -->
  <div v-if="loading" class="bg-surface-container-lowest border-[3px] border-outline p-8 text-center shadow-[4px_4px_0px_#000000]">
    <span class="material-symbols-outlined text-[40px] animate-spin">refresh</span>
  </div>
  <div v-else class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-primary text-on-primary font-label uppercase text-label">
          <th class="p-3 border-r-[2px] border-outline w-12">#</th>
          <th class="p-3 border-r-[2px] border-outline">Requirement</th>
          <th class="p-3 border-r-[2px] border-outline">Status</th>
          <th class="p-3 border-r-[2px] border-outline">Linked Test Cases</th>
          <th class="p-3 border-r-[2px] border-outline">Test Results</th>
          <th class="p-3">Coverage</th>
        </tr>
      </thead>
      <tbody class="font-body text-body divide-y-[2px] divide-outline">
        <tr v-for="(req, idx) in filteredReqs" :key="req.id" class="hover:bg-surface-container transition-colors">
          <td class="p-3 border-r-[2px] border-outline font-label text-on-surface-variant">{{ idx + 1 }}</td>
          <td class="p-3 border-r-[2px] border-outline font-bold">{{ req.title }}</td>
          <td class="p-3 border-r-[2px] border-outline">
            <span class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px] bg-surface-container-highest">{{ req.status }}</span>
          </td>
          <td class="p-3 border-r-[2px] border-outline">
            <div v-if="getCoveredCases(req.id).length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="tc in getCoveredCases(req.id).slice(0, 3)"
                :key="tc.id"
                class="px-1.5 py-0.5 bg-surface border-[1px] border-outline font-label text-[10px] uppercase"
              >{{ tc.title.substring(0, 20) }}…</span>
              <span v-if="getCoveredCases(req.id).length > 3" class="px-1.5 py-0.5 bg-primary text-on-primary border-[1px] border-outline font-label text-[10px]">+{{ getCoveredCases(req.id).length - 3 }}</span>
            </div>
            <span v-else class="text-on-surface-variant text-label">—</span>
          </td>
          <td class="p-3 border-r-[2px] border-outline">
            <div class="flex items-center gap-2">
              <span class="text-[#15803d] font-bold">{{ getCoveredCases(req.id).filter(t => t.status === 'Passed').length }} P</span>
              <span class="text-error font-bold">{{ getCoveredCases(req.id).filter(t => t.status === 'Failed').length }} F</span>
              <span class="text-on-surface-variant">{{ getCoveredCases(req.id).filter(t => !['Passed','Failed'].includes(t.status)).length }} -</span>
            </div>
          </td>
          <td class="p-3">
            <span class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]" :class="coverageColor[getCoverageStatus(req.id)]">
              {{ getCoverageStatus(req.id) }}
            </span>
          </td>
        </tr>
        <tr v-if="filteredReqs.length === 0">
          <td colspan="6" class="p-8 text-center text-on-surface-variant font-label uppercase">No requirements found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
