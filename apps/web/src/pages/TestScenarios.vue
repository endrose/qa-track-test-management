<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const scenarios = ref<any[]>([])
const projects = ref<any[]>([])
const requirements = ref<any[]>([])
const searchQuery = ref('')
const filterStatus = ref('')
const filterProjectId = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)

const form = ref({
  id: '',
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Draft',
  projectId: '',
  requirementId: ''
})

const priorities = ['Low', 'Medium', 'High', 'Critical']
const statuses = ['Draft', 'Active', 'Deprecated', 'Archived']

const filtered = computed(() =>
  scenarios.value.filter(s => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q || s.title.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
    const matchStatus = !filterStatus.value || s.status === filterStatus.value
    const matchProject = !filterProjectId.value || s.project?.id === filterProjectId.value
    return matchSearch && matchStatus && matchProject
  })
)

const fetchScenarios = async () => {
  loading.value = true
  try {
    const res = await fetch('http://127.0.0.1:3000/api/test-cases')
    if (res.ok) scenarios.value = await res.json()
  } finally {
    loading.value = false
  }
}

const fetchProjects = async () => {
  const res = await fetch('http://127.0.0.1:3000/api/projects')
  if (res.ok) projects.value = await res.json()
}

const fetchRequirements = async () => {
  const res = await fetch('http://127.0.0.1:3000/api/requirements')
  if (res.ok) requirements.value = await res.json()
}

const openCreate = () => {
  form.value = { id: '', title: '', description: '', priority: 'Medium', status: 'Draft', projectId: '', requirementId: '' }
  isEditing.value = false
  showModal.value = true
}

const openEdit = (s: any) => {
  form.value = {
    id: s.id,
    title: s.title,
    description: s.description || '',
    priority: s.priority || 'Medium',
    status: s.status || 'Draft',
    projectId: s.project?.id || '',
    requirementId: ''
  }
  isEditing.value = true
  showModal.value = true
}

const saveScenario = async () => {
  const url = isEditing.value
    ? `http://127.0.0.1:3000/api/test-cases/${form.value.id}`
    : 'http://127.0.0.1:3000/api/test-cases'
  const method = isEditing.value ? 'PUT' : 'POST'
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: form.value.title,
      description: form.value.description,
      priority: form.value.priority,
      status: form.value.status,
      project: form.value.projectId ? { id: form.value.projectId } : null
    })
  })
  if (res.ok) {
    showModal.value = false
    await fetchScenarios()
  }
}

const deleteScenario = async (id: string) => {
  if (!confirm('Delete this scenario?')) return
  await fetch(`http://127.0.0.1:3000/api/test-cases/${id}`, { method: 'DELETE' })
  await fetchScenarios()
}

const priorityColor: Record<string, string> = {
  Low: 'bg-[#93c5fd]', Medium: 'bg-[#fde047]', High: 'bg-[#fdba74]', Critical: 'bg-[#ef4444] text-white'
}
const statusColor: Record<string, string> = {
  Draft: 'bg-surface-container-highest', Active: 'bg-[#86efac]', Deprecated: 'bg-[#fca5a5]', Archived: 'bg-surface-dim'
}

onMounted(() => {
  fetchScenarios()
  fetchProjects()
  fetchRequirements()
})
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div>
      <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline">Testing</span>
      <h1 class="font-display text-display uppercase tracking-tight mt-1">Test Scenarios</h1>
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
    <select v-model="filterProjectId" class="px-3 py-2 bg-surface border-[2px] border-outline font-label text-body outline-none shadow-[2px_2px_0px_#000000]">
      <option value="">All Projects</option>
      <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
    </select>
    <select v-model="filterStatus" class="px-3 py-2 bg-surface border-[2px] border-outline font-label text-body outline-none shadow-[2px_2px_0px_#000000]">
      <option value="">All Statuses</option>
      <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
    </select>
    <span class="font-label text-label text-on-surface-variant">{{ filtered.length }} scenarios</span>
  </div>

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
        <div class="flex flex-col gap-1 flex-1">
          <h3 class="font-headline text-headline uppercase leading-tight">{{ s.title }}</h3>
          <span v-if="s.project" class="px-2 py-0.5 bg-[#a78bfa] text-white font-label uppercase text-[9px] border-[2px] border-outline w-fit">{{ s.project.name }}</span>
        </div>
        <span class="font-label text-[10px] uppercase px-2 py-0.5 border-[2px] border-outline flex-shrink-0" :class="priorityColor[s.priority] || 'bg-surface'">{{ s.priority }}</span>
      </div>
      <p class="text-body text-on-surface-variant flex-1 text-sm">{{ s.description || '—' }}</p>
      <div class="flex items-center justify-between pt-2 border-t-[2px] border-outline">
        <span class="font-label text-[10px] uppercase px-2 py-0.5 border-[2px] border-outline" :class="statusColor[s.status] || 'bg-surface'">{{ s.status }}</span>
        <div class="flex gap-2">
          <button @click="openEdit(s)" class="p-1.5 bg-surface border-[2px] border-outline hover:bg-primary hover:text-on-primary transition-colors shadow-[2px_2px_0px_#000000]">
            <span class="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button @click="deleteScenario(s.id)" class="p-1.5 bg-surface border-[2px] border-outline hover:bg-[#ef4444] hover:text-white transition-colors shadow-[2px_2px_0px_#000000]">
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
          <input v-model="form.title" required class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none shadow-[2px_2px_0px_#000000]" />
        </div>
        <div>
          <label class="font-label uppercase text-label block mb-1">Description</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none shadow-[2px_2px_0px_#000000] resize-none"></textarea>
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
        <div>
          <label class="font-label uppercase text-label block mb-1">Project</label>
          <select v-model="form.projectId" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none shadow-[2px_2px_0px_#000000]">
            <option value="">— None —</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="flex gap-3 pt-2 border-t-[2px] border-outline">
          <button type="submit" class="flex-1 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Save</button>
          <button type="button" @click="showModal = false" class="flex-1 py-2 bg-surface font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>
