<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface TestScenario {
  id: number
  title: string
  description: string
  priority: string
  status: string
  requirementId?: number
  createdAt?: string
}

const scenarios = ref<TestScenario[]>([])
const searchQuery = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const error = ref('')

const form = ref({ id: 0, title: '', description: '', priority: 'Medium', status: 'Draft', requirementId: undefined as number | undefined })

const priorities = ['Low', 'Medium', 'High', 'Critical']
const statuses = ['Draft', 'Active', 'Deprecated', 'Archived']

const filtered = computed(() =>
  scenarios.value.filter(s => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q || s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
    const matchStatus = !filterStatus.value || s.status === filterStatus.value
    const matchPriority = !filterPriority.value || s.priority === filterPriority.value
    return matchSearch && matchStatus && matchPriority
  })
)

const token = localStorage.getItem('token') || ''

const fetchScenarios = async () => {
  loading.value = true
  try {
    // Using test-cases endpoint as a proxy for scenarios
    const res = await fetch('http://localhost:3000/api/test-cases', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      // Map test cases to scenario shape
      scenarios.value = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description || '',
        priority: d.priority || 'Medium',
        status: d.status || 'Draft',
      }))
    }
  } catch {
    error.value = 'Failed to load scenarios'
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  form.value = { id: 0, title: '', description: '', priority: 'Medium', status: 'Draft', requirementId: undefined }
  isEditing.value = false
  showModal.value = true
}

const openEdit = (s: TestScenario) => {
  form.value = { id: s.id, title: s.title, description: s.description, priority: s.priority, status: s.status, requirementId: s.requirementId }
  isEditing.value = true
  showModal.value = true
}

const saveScenario = async () => {
  try {
    const url = isEditing.value
      ? `http://localhost:3000/api/test-cases/${form.value.id}`
      : 'http://localhost:3000/api/test-cases'
    const method = isEditing.value ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: form.value.title, description: form.value.description, priority: form.value.priority, status: form.value.status })
    })
    if (res.ok) {
      showModal.value = false
      await fetchScenarios()
    }
  } catch {
    error.value = 'Save failed'
  }
}

const deleteScenario = async (id: number) => {
  if (!confirm('Delete this scenario?')) return
  try {
    await fetch(`http://localhost:3000/api/test-cases/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchScenarios()
  } catch {
    error.value = 'Delete failed'
  }
}

const priorityColor: Record<string, string> = {
  Low: 'bg-[#93c5fd]', Medium: 'bg-[#fde047]', High: 'bg-[#fdba74]', Critical: 'bg-[#ef4444] text-white'
}
const statusColor: Record<string, string> = {
  Draft: 'bg-surface-container-highest', Active: 'bg-[#86efac]', Deprecated: 'bg-[#fca5a5]', Archived: 'bg-surface-dim'
}

onMounted(fetchScenarios)
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline">Testing</span>
      </div>
      <h1 class="font-display text-display uppercase tracking-tight">Test Scenarios</h1>
    </div>
    <button @click="openCreate" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
      <span class="material-symbols-outlined text-[18px]">add</span> New Scenario
    </button>
  </div>

  <!-- Filters -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-wrap gap-3 items-center">
    <div class="flex items-center gap-2 px-3 py-2 bg-surface border-[2px] border-outline flex-1 min-w-[200px]">
      <span class="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
      <input v-model="searchQuery" type="text" placeholder="Search scenarios..." class="flex-1 bg-transparent outline-none text-body" />
    </div>
    <select v-model="filterStatus" class="px-3 py-2 bg-surface border-[2px] border-outline font-label text-body outline-none shadow-[2px_2px_0px_#000000]">
      <option value="">All Statuses</option>
      <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
    </select>
    <select v-model="filterPriority" class="px-3 py-2 bg-surface border-[2px] border-outline font-label text-body outline-none shadow-[2px_2px_0px_#000000]">
      <option value="">All Priorities</option>
      <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
    </select>
    <span class="font-label text-label text-on-surface-variant">{{ filtered.length }} scenarios</span>
  </div>

  <!-- Error -->
  <div v-if="error" class="bg-[#fca5a5] border-[2px] border-outline p-3 font-label uppercase text-body">{{ error }}</div>

  <!-- Loading -->
  <div v-if="loading" class="bg-surface-container-lowest border-[3px] border-outline p-8 text-center font-label uppercase shadow-[4px_4px_0px_#000000]">
    <span class="material-symbols-outlined text-[40px] animate-spin">refresh</span>
  </div>

  <!-- Scenarios Grid -->
  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="s in filtered" :key="s.id"
      class="bg-surface-container-lowest border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col gap-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] transition-all"
    >
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-headline text-headline uppercase leading-tight flex-1">{{ s.title }}</h3>
        <span class="font-label text-[10px] uppercase px-2 py-0.5 border-[2px] border-outline" :class="priorityColor[s.priority] || 'bg-surface'">{{ s.priority }}</span>
      </div>
      <p class="text-body text-on-surface-variant flex-1">{{ s.description || '—' }}</p>
      <div class="flex items-center justify-between pt-2 border-t-[2px] border-outline">
        <span class="font-label text-[10px] uppercase px-2 py-0.5 border-[2px] border-outline" :class="statusColor[s.status] || 'bg-surface'">{{ s.status }}</span>
        <div class="flex gap-2">
          <button @click="openEdit(s)" class="p-1.5 bg-surface border-[2px] border-outline hover:bg-primary hover:text-on-primary transition-colors shadow-[2px_2px_0px_#000000]">
            <span class="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button @click="deleteScenario(s.id)" class="p-1.5 bg-surface border-[2px] border-outline hover:bg-error hover:text-on-error transition-colors shadow-[2px_2px_0px_#000000]">
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="filtered.length === 0 && !loading" class="col-span-full bg-surface-container-lowest border-[3px] border-outline p-12 text-center shadow-[4px_4px_0px_#000000]">
      <span class="material-symbols-outlined text-[48px] text-on-surface-variant">account_tree</span>
      <p class="font-label uppercase mt-2 text-on-surface-variant">No scenarios found</p>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-surface border-[3px] border-outline shadow-[8px_8px_0px_#000000] w-full max-w-lg">
      <div class="flex items-center justify-between p-4 border-b-[3px] border-outline bg-primary text-on-primary">
        <h2 class="font-headline text-headline uppercase">{{ isEditing ? 'Edit Scenario' : 'New Scenario' }}</h2>
        <button @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
      </div>
      <form @submit.prevent="saveScenario" class="p-4 space-y-4">
        <div>
          <label class="font-label uppercase text-label block mb-1">Title *</label>
          <input v-model="form.title" required class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000000]" />
        </div>
        <div>
          <label class="font-label uppercase text-label block mb-1">Description</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000000] resize-none"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-label uppercase text-label block mb-1">Priority</label>
            <select v-model="form.priority" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none shadow-[2px_2px_0px_#000000]">
              <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div>
            <label class="font-label uppercase text-label block mb-1">Status</label>
            <select v-model="form.status" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none shadow-[2px_2px_0px_#000000]">
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3 pt-2 border-t-[2px] border-outline">
          <button type="submit" class="flex-1 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Save</button>
          <button type="button" @click="showModal = false" class="flex-1 py-2 bg-surface font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>
