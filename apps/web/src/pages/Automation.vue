<script setup lang="ts">
import { ref, onMounted } from 'vue'

const runs = ref<any[]>([])
const projects = ref<any[]>([])
const isModalOpen = ref(false)
const isLogModalOpen = ref(false)
const currentLog = ref('')
const newRun = ref({ suiteName: '', projectId: '', framework: 'Playwright' })

const statusColors: Record<string, string> = {
  'Passed':  'bg-[#86efac]',
  'Failed':  'bg-[#ef4444] text-white',
  'Running': 'bg-[#93c5fd]',
  'Skipped': 'bg-surface-container-highest',
}

const fetchData = async () => {
  try {
    const [rRes, pRes] = await Promise.all([
      fetch('http://127.0.0.1:3000/api/automation'),
      fetch('http://127.0.0.1:3000/api/projects'),
    ])
    if (rRes.ok) runs.value = await rRes.json()
    if (pRes.ok) projects.value = await pRes.json()
  } catch (err) {
    console.error('Failed to fetch', err)
  }
}

const triggerRun = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/automation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suiteName: newRun.value.suiteName,
        framework: newRun.value.framework,
        status: 'Running',
        project: newRun.value.projectId ? { id: newRun.value.projectId } : null,
      }),
    })
    if (res.ok) {
      isModalOpen.value = false
      newRun.value = { suiteName: '', projectId: '', framework: 'Playwright' }
      fetchData()
    }
  } catch (err) {
    console.error('Failed to trigger run', err)
  }
}

const deleteRun = async (id: string) => {
  await fetch(`http://127.0.0.1:3000/api/automation/${id}`, { method: 'DELETE' })
  fetchData()
}

const viewLog = (log: string) => {
  currentLog.value = log || 'No logs available.'
  isLogModalOpen.value = true
}

onMounted(() => {
  fetchData()
  setInterval(fetchData, 5000) // Poll for updates
})
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Automation</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Automation Runs</h1>
    </div>
    <div class="flex items-center gap-3">
      <a
        href="http://127.0.0.1:3000/allure/index.html"
        target="_blank"
        class="px-4 py-2 bg-[#a78bfa] text-white font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">bar_chart_4_bars</span> Allure Report
      </a>
      <button @click="isModalOpen = true" class="px-4 py-2 bg-[#93c5fd] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">smart_toy</span> Trigger Run
      </button>
    </div>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div v-for="s in ['Passed','Failed','Running','Skipped']" :key="s" :class="statusColors[s]" class="border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <span class="font-label uppercase text-label">{{ s }}</span>
      <span class="font-display text-display font-black">{{ runs.filter(r => r.status === s).length }}</span>
    </div>
  </div>

  <!-- Table -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex items-center justify-between mb-4 pb-2 border-b-[2px] border-outline">
      <h2 class="font-headline text-headline uppercase flex items-center gap-2">
        <span class="material-symbols-outlined">terminal</span> Run History
      </h2>
      <button @click="fetchData" class="flex items-center gap-2 px-2 py-1 bg-surface border-[2px] border-outline text-label font-label uppercase hover:bg-surface-container">
        <span class="material-symbols-outlined text-[16px]">refresh</span> Refresh
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">Suite</th>
            <th class="p-3 border-r-[2px] border-outline">Framework</th>
            <th class="p-3 border-r-[2px] border-outline">Status</th>
            <th class="p-3 border-r-[2px] border-outline">Passed</th>
            <th class="p-3 border-r-[2px] border-outline">Failed</th>
            <th class="p-3 border-r-[2px] border-outline">Date</th>
            <th class="p-3">Actions</th>
            <th class="p-3">Report</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="runs.length === 0">
            <td colspan="7" class="p-4 text-center text-on-surface-variant">No automation runs yet.</td>
          </tr>
          <tr v-for="run in runs" :key="run.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ run.suiteName }}</td>
            <td class="p-3 border-r-[2px] border-outline font-label uppercase text-[10px]">{{ run.framework || 'Playwright' }}</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="statusColors[run.status] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ run.status }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline text-[#15803d] font-bold">{{ run.passed }}</td>
            <td class="p-3 border-r-[2px] border-outline text-error font-bold">{{ run.failed }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ new Date(run.createdAt).toLocaleString() }}</td>
            <td class="p-3 flex items-center gap-2">
              <button @click="viewLog(run.log)" class="px-2 py-1 bg-[#fde047] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
                Logs
              </button>
              <button @click="deleteRun(run.id)" class="px-2 py-1 bg-[#fca5a5] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
                Delete
              </button>
            </td>
            <td class="p-3">
              <a
                v-if="(run.framework || '').toLowerCase() === 'playwright' && run.status !== 'Running'"
                href="http://127.0.0.1:3000/allure/index.html"
                target="_blank"
                class="px-2 py-1 bg-[#a78bfa] text-white font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-1 w-fit"
              >
                <span class="material-symbols-outlined text-[12px]">bar_chart_4_bars</span> Allure
              </a>
              <span v-else class="text-on-surface-variant text-[10px] font-label">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Trigger Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline text-headline uppercase mb-4">Trigger Automation Run</h2>
      <form @submit.prevent="triggerRun" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Suite Name</label>
          <input v-model="newRun.suiteName" type="text" placeholder="e.g. Regression Suite v3" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" required />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Framework</label>
          <select v-model="newRun.framework" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
            <option value="Playwright">Playwright</option>
            <option value="Cypress">Cypress</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Project</label>
          <select v-model="newRun.projectId" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
            <option value="">— None —</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Trigger</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Log Modal -->
  <div v-if="isLogModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-4xl max-h-[80vh] flex flex-col bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <div class="flex items-center justify-between mb-4 border-b-[2px] border-outline pb-2">
        <h2 class="font-headline text-headline uppercase">Execution Logs</h2>
        <button @click="isLogModalOpen = false" class="material-symbols-outlined hover:text-error transition-colors">close</button>
      </div>
      <div class="flex-1 overflow-y-auto bg-[#1e1e1e] p-4 border-[2px] border-outline">
        <pre class="font-mono text-[12px] text-[#d4d4d4] whitespace-pre-wrap">{{ currentLog }}</pre>
      </div>
    </div>
  </div>
</template>

