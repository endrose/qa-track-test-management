<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const executions = ref<any[]>([])
const testCases = ref<any[]>([])
const isModalOpen = ref(false)
const newExec = ref({ testCaseId: '', status: 'Pass', comments: '' })

const statusColors: Record<string, string> = {
  'Pass': 'bg-[#86efac]',
  'Fail': 'bg-[#ef4444] text-white',
  'Blocked': 'bg-[#fdba74]',
  'Not Run': 'bg-surface-container-highest',
}

const fetchData = async () => {
  try {
    const [exRes, tcRes] = await Promise.all([
      fetch('http://localhost:3000/api/test-executions'),
      fetch('http://localhost:3000/api/test-cases'),
    ])
    if (exRes.ok) executions.value = await exRes.json()
    if (tcRes.ok) testCases.value = await tcRes.json()
  } catch (err) {
    console.error('Failed to fetch', err)
  }
}

const createExecution = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/test-executions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newExec.value.status,
        comments: newExec.value.comments,
        testCase: newExec.value.testCaseId ? { id: newExec.value.testCaseId } : null,
      }),
    })
    if (res.ok) {
      isModalOpen.value = false
      newExec.value = { testCaseId: '', status: 'Pass', comments: '' }
      fetchData()
    }
  } catch (err) {
    console.error('Failed to create execution', err)
  }
}

const deleteExecution = async (id: string) => {
  if (!confirm('Delete this execution log?')) return
  try {
    const res = await fetch(`http://localhost:3000/api/test-executions/${id}`, { method: 'DELETE' })
    if (res.ok) fetchData()
  } catch (err) {
    console.error('Failed to delete execution', err)
  }
}

const statusCount = (status: string) =>
  executions.value.filter(e => e.status === status).length

onMounted(fetchData)
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline">Executions</span>
      </div>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Test Executions</h1>
    </div>
    <button @click="isModalOpen = true" class="px-4 py-2 bg-[#fde047] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
      <span class="material-symbols-outlined text-[18px]">play_arrow</span> Log Execution
    </button>
  </div>

  <!-- KPI Chips -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div v-for="s in ['Pass','Fail','Blocked','Not Run']" :key="s" :class="statusColors[s]" class="border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <span class="font-label uppercase text-label">{{ s }}</span>
      <span class="font-display text-display font-black">{{ statusCount(s) }}</span>
    </div>
  </div>

  <!-- Table -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <h2 class="font-headline text-headline uppercase flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
      <span class="material-symbols-outlined">history</span> Execution Log
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">ID</th>
            <th class="p-3 border-r-[2px] border-outline">Status</th>
            <th class="p-3 border-r-[2px] border-outline">Comments</th>
            <th class="p-3 border-r-[2px] border-outline">Date</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="executions.length === 0">
            <td colspan="4" class="p-4 text-center text-on-surface-variant">No executions logged yet.</td>
          </tr>
          <tr v-for="ex in executions" :key="ex.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold text-[11px]">{{ ex.id.slice(0, 8) }}…</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="statusColors[ex.status] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ ex.status }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">{{ ex.comments || '—' }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ new Date(ex.createdAt).toLocaleDateString() }}</td>
            <td class="p-3">
              <button @click="deleteExecution(ex.id)" class="px-2 py-1 bg-[#fca5a5] text-on-surface border-[2px] border-outline font-label uppercase text-[10px] hover:bg-error hover:text-white transition-colors shadow-[1px_1px_0px_#000000]">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline text-headline uppercase mb-4">Log New Execution</h2>
      <form @submit.prevent="createExecution" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Test Case</label>
          <select v-model="newExec.testCaseId" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
            <option value="">— None —</option>
            <option v-for="tc in testCases" :key="tc.id" :value="tc.id">{{ tc.title }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Result</label>
          <select v-model="newExec.status" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
            <option>Pass</option>
            <option>Fail</option>
            <option>Blocked</option>
            <option>Not Run</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Comments</label>
          <textarea v-model="newExec.comments" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" rows="3"></textarea>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Log</button>
        </div>
      </form>
    </div>
  </div>
</template>
