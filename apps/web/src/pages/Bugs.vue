<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const bugs = ref<any[]>([])
const projects = ref<any[]>([])
const isModalOpen = ref(false)
const isEditOpen = ref(false)
const isDetailOpen = ref(false)
const editBug = ref<any>(null)
const detailBug = ref<any>(null)
const newBug = ref({ title: '', description: '', severity: 'Major', status: 'Open', projectId: '' })
const filterStatus = ref('')
const filterSeverity = ref('')
const uploadingLog = ref(false)

const rcaCategories = [
  { value: 'BACKEND_API', label: 'Backend API', color: 'bg-[#fca5a5]' },
  { value: 'DATABASE', label: 'Database Issue', color: 'bg-[#fdba74]' },
  { value: 'FRONTEND_UI', label: 'UI Regression', color: 'bg-[#93c5fd]' },
  { value: 'NETWORK_INFRA', label: 'Network / Infra', color: 'bg-[#c4b5fd]' },
  { value: 'ENVIRONMENT_CONFIG', label: 'Environment Config', color: 'bg-[#fde047]' },
  { value: 'THIRD_PARTY', label: 'Third Party', color: 'bg-[#86efac]' },
]

const rcaColor = (cat: string) => rcaCategories.find(r => r.value === cat)?.color || 'bg-surface-container'
const rcaLabel = (cat: string) => rcaCategories.find(r => r.value === cat)?.label || cat

const severityColors: Record<string, string> = {
  'Critical': 'bg-[#ef4444] text-white',
  'Major': 'bg-[#fdba74]',
  'Minor': 'bg-[#fde047]',
  'Low': 'bg-surface-container-highest',
}
const statusColors: Record<string, string> = {
  'Open': 'bg-[#ef4444] text-white',
  'In Progress': 'bg-[#93c5fd]',
  'Resolved': 'bg-[#86efac]',
  'Closed': 'bg-surface-container-highest',
}

const filteredBugs = computed(() => bugs.value.filter(b => {
  if (filterStatus.value && b.status !== filterStatus.value) return false
  if (filterSeverity.value && b.severity !== filterSeverity.value) return false
  return true
}))

const fetchBugs = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/bugs')
    if (res.ok) bugs.value = await res.json()
  } catch (err) { console.error('Failed to fetch bugs', err) }
}

const fetchProjects = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/projects')
    if (res.ok) projects.value = await res.json()
  } catch (err) { console.error('Failed to fetch projects', err) }
}

const createBug = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/bugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newBug.value, project: newBug.value.projectId ? { id: newBug.value.projectId } : null }),
    })
    if (res.ok) {
      isModalOpen.value = false
      newBug.value = { title: '', description: '', severity: 'Major', status: 'Open', projectId: '' }
      fetchBugs()
    }
  } catch (err) { console.error('Failed to create bug', err) }
}

const openEdit = (bug: any) => {
  editBug.value = {
    ...bug,
    projectId: bug.project?.id || '',
    logAttachments: bug.logAttachments || []
  }
  isEditOpen.value = true
}

const openDetail = (bug: any) => {
  detailBug.value = bug
  isDetailOpen.value = true
}

const updateBug = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/bugs/${editBug.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editBug.value.title,
        description: editBug.value.description,
        severity: editBug.value.severity,
        status: editBug.value.status,
        rootCauseCategory: editBug.value.rootCauseCategory,
        rootCauseDescription: editBug.value.rootCauseDescription,
        logAttachments: editBug.value.logAttachments,
        project: editBug.value.projectId ? { id: editBug.value.projectId } : null,
      }),
    })
    if (res.ok) {
      isEditOpen.value = false
      editBug.value = null
      fetchBugs()
    }
  } catch (err) { console.error('Failed to update bug', err) }
}

const deleteBug = async (id: string) => {
  if (!confirm('Delete this bug?')) return
  await fetch(`http://127.0.0.1:3000/api/bugs/${id}`, { method: 'DELETE' })
  fetchBugs()
}

const handleLogUpload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  uploadingLog.value = true
  for (const file of Array.from(files)) {
    // Read file content (for log text files)
    const reader = new FileReader()
    reader.onload = () => {
      const entry = { name: file.name, size: file.size, type: file.type, content: reader.result as string }
      if (!editBug.value.logAttachments) editBug.value.logAttachments = []
      editBug.value.logAttachments.push(entry)
    }
    reader.readAsText(file)
  }
  uploadingLog.value = false
}

const removeAttachment = (idx: number) => {
  editBug.value.logAttachments.splice(idx, 1)
}

const downloadAttachment = (att: any) => {
  const blob = new Blob([att.content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = att.name
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => { fetchBugs(); fetchProjects() })
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Quality</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Bugs</h1>
    </div>
    <div class="flex gap-3">
      <button @click="isModalOpen = true" class="px-4 py-2 bg-[#fca5a5] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">bug_report</span> Create Bug
      </button>
    </div>
  </div>

  <!-- KPI Chips -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div v-for="s in ['Open','In Progress','Resolved','Closed']" :key="s" :class="statusColors[s]" class="border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <span class="font-label uppercase text-label">{{ s }}</span>
      <span class="font-display text-display font-black">{{ bugs.filter(b => b.status === s).length }}</span>
    </div>
  </div>

  <!-- RCA Summary -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <h2 class="font-headline text-headline uppercase flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
      <span class="material-symbols-outlined">manage_search</span> Root Cause Distribution
    </h2>
    <div class="flex flex-wrap gap-3">
      <div v-for="cat in rcaCategories" :key="cat.value" :class="cat.color" class="flex items-center gap-2 px-3 py-2 border-[2px] border-outline shadow-[2px_2px_0px_#000000]">
        <span class="font-label uppercase text-[10px]">{{ cat.label }}</span>
        <span class="font-black text-sm">{{ bugs.filter(b => b.rootCauseCategory === cat.value).length }}</span>
      </div>
      <div class="flex items-center gap-2 px-3 py-2 border-[2px] border-outline shadow-[2px_2px_0px_#000000] bg-surface-container">
        <span class="font-label uppercase text-[10px]">Unclassified</span>
        <span class="font-black text-sm">{{ bugs.filter(b => !b.rootCauseCategory).length }}</span>
      </div>
    </div>
  </div>

  <!-- Filter Bar -->
  <div class="flex flex-wrap gap-3 items-center">
    <select v-model="filterStatus" class="px-3 py-2 bg-surface border-[2px] border-outline text-sm font-label">
      <option value="">All Status</option>
      <option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
    </select>
    <select v-model="filterSeverity" class="px-3 py-2 bg-surface border-[2px] border-outline text-sm font-label">
      <option value="">All Severity</option>
      <option>Critical</option><option>Major</option><option>Minor</option><option>Low</option>
    </select>
    <button v-if="filterStatus || filterSeverity" @click="filterStatus=''; filterSeverity=''" class="px-3 py-2 border-[2px] border-outline text-sm font-label hover:bg-surface-dim">Clear Filters</button>
    <span class="text-sm text-on-surface-variant ml-auto">Showing {{ filteredBugs.length }} of {{ bugs.length }} bugs</span>
  </div>

  <!-- Table -->
  <div class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000]">
    <div class="p-gutter border-b-[2px] border-outline flex items-center gap-2">
      <span class="material-symbols-outlined">pest_control</span>
      <h2 class="font-headline text-headline uppercase">Bug List</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">Title</th>
            <th class="p-3 border-r-[2px] border-outline hidden md:table-cell">Project</th>
            <th class="p-3 border-r-[2px] border-outline">Severity</th>
            <th class="p-3 border-r-[2px] border-outline">Status</th>
            <th class="p-3 border-r-[2px] border-outline hidden lg:table-cell">RCA Category</th>
            <th class="p-3 border-r-[2px] border-outline hidden lg:table-cell">Logs</th>
            <th class="p-3 border-r-[2px] border-outline hidden md:table-cell">Created</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="filteredBugs.length === 0">
            <td colspan="8" class="p-8 text-center text-on-surface-variant">No bugs found.</td>
          </tr>
          <tr v-for="bug in filteredBugs" :key="bug.id" class="hover:bg-surface-container transition-colors cursor-pointer" @click="openDetail(bug)">
            <td class="p-3 border-r-[2px] border-outline font-bold" @click.stop>
              <span class="cursor-pointer hover:underline" @click="openDetail(bug)">{{ bug.title }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline hidden md:table-cell">
              <span v-if="bug.project" class="px-2 py-0.5 bg-[#93c5fd] border-[2px] border-outline font-label uppercase text-[10px]">{{ bug.project.name }}</span>
              <span v-else class="text-on-surface-variant text-[10px]">—</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="severityColors[bug.severity] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ bug.severity }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="statusColors[bug.status] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ bug.status }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline hidden lg:table-cell">
              <span v-if="bug.rootCauseCategory" :class="rcaColor(bug.rootCauseCategory)" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ rcaLabel(bug.rootCauseCategory) }}</span>
              <span v-else class="text-on-surface-variant text-[10px]">Unclassified</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline hidden lg:table-cell">
              <span v-if="bug.logAttachments?.length" class="flex items-center gap-1 text-[11px] font-label">
                <span class="material-symbols-outlined text-[14px]">attach_file</span>
                {{ bug.logAttachments.length }} file(s)
              </span>
              <span v-else class="text-on-surface-variant text-[10px]">—</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline hidden md:table-cell text-sm">{{ new Date(bug.createdAt).toLocaleDateString() }}</td>
            <td class="p-3 flex gap-2" @click.stop>
              <button @click="openEdit(bug)" class="px-2 py-1 bg-[#93c5fd] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Edit</button>
              <button @click="deleteBug(bug.id)" class="px-2 py-1 bg-[#fca5a5] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Create Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline text-headline uppercase mb-4">Create Bug</h2>
      <form @submit.prevent="createBug" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Title</label>
          <input v-model="newBug.title" type="text" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" required />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Description</label>
          <textarea v-model="newBug.description" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" rows="3"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Severity</label>
            <select v-model="newBug.severity" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>Critical</option><option>Major</option><option>Minor</option><option>Low</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Status</label>
            <select v-model="newBug.status" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Project</label>
          <select v-model="newBug.projectId" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
            <option value="">— None —</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Save</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Edit Modal with RCA -->
  <div v-if="isEditOpen && editBug" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
    <div class="w-full max-w-2xl bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000] my-4">
      <div class="flex items-center gap-2 mb-4 pb-3 border-b-[2px] border-outline">
        <span class="material-symbols-outlined text-[#ef4444]">bug_report</span>
        <h2 class="font-headline text-headline uppercase">Edit Bug</h2>
      </div>
      <form @submit.prevent="updateBug" class="space-y-4">
        <!-- Basic Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1 md:col-span-2">
            <label class="font-label uppercase text-label">Title</label>
            <input v-model="editBug.title" type="text" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" required />
          </div>
          <div class="flex flex-col gap-1 md:col-span-2">
            <label class="font-label uppercase text-label">Description</label>
            <textarea v-model="editBug.description" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" rows="3"></textarea>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Severity</label>
            <select v-model="editBug.severity" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>Critical</option><option>Major</option><option>Minor</option><option>Low</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Status</label>
            <select v-model="editBug.status" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
            </select>
          </div>
          <div class="flex flex-col gap-1 md:col-span-2">
            <label class="font-label uppercase text-label">Project</label>
            <select v-model="editBug.projectId" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option value="">— None —</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
        </div>

        <!-- RCA Section -->
        <div class="border-[2px] border-outline p-4 bg-surface">
          <h3 class="font-headline uppercase text-sm flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-[18px]">manage_search</span> Root Cause Analysis (RCA)
          </h3>
          <div class="space-y-4">
            <div class="flex flex-col gap-1">
              <label class="font-label uppercase text-label text-[11px]">Root Cause Category</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  v-for="cat in rcaCategories" :key="cat.value" type="button"
                  @click="editBug.rootCauseCategory = editBug.rootCauseCategory === cat.value ? null : cat.value"
                  :class="[cat.color, editBug.rootCauseCategory === cat.value ? 'border-[3px] border-black shadow-none translate-x-[2px] translate-y-[2px]' : 'border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px]']"
                  class="px-2 py-2 font-label uppercase text-[10px] transition-all text-left"
                >
                  <span v-if="editBug.rootCauseCategory === cat.value" class="mr-1">✓</span>
                  {{ cat.label }}
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-label uppercase text-label text-[11px]">Root Cause Details / Analysis</label>
              <textarea v-model="editBug.rootCauseDescription" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000] text-sm" rows="4" placeholder="Jelaskan akar masalah secara teknis, langkah reproduksi, dan temuan investigasi..."></textarea>
            </div>
          </div>
        </div>

        <!-- Log Attachments -->
        <div class="border-[2px] border-outline p-4 bg-surface">
          <h3 class="font-headline uppercase text-sm flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-[18px]">attach_file</span> Log Attachments
          </h3>
          <label class="flex items-center gap-2 px-4 py-3 border-[2px] border-dashed border-outline cursor-pointer hover:bg-surface-dim transition-colors">
            <span class="material-symbols-outlined text-[20px]">upload_file</span>
            <span class="font-label uppercase text-sm">Upload Log Files (.log, .txt, .har)</span>
            <input type="file" class="hidden" multiple accept=".log,.txt,.har,.json" @change="handleLogUpload" />
          </label>
          <div v-if="editBug.logAttachments?.length" class="mt-3 space-y-2">
            <div v-for="(att, idx) in editBug.logAttachments" :key="idx"
              class="flex items-center justify-between p-2 bg-surface border-[2px] border-outline">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">description</span>
                <span class="font-label text-sm">{{ att.name }}</span>
                <span class="text-[10px] text-on-surface-variant">({{ (att.size / 1024).toFixed(1) }} KB)</span>
              </div>
              <div class="flex gap-2">
                <button type="button" @click="downloadAttachment(att)" class="px-2 py-1 bg-[#93c5fd] border-[2px] border-outline text-[10px] font-label uppercase hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Download</button>
                <button type="button" @click="removeAttachment(idx)" class="px-2 py-1 bg-[#fca5a5] border-[2px] border-outline text-[10px] font-label uppercase hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Remove</button>
              </div>
            </div>
          </div>
          <p v-else class="text-[11px] text-on-surface-variant mt-2">No log files attached yet.</p>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isEditOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Update Bug</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Detail Drawer -->
  <div v-if="isDetailOpen && detailBug" class="fixed inset-0 z-50 flex items-start justify-end bg-black/40" @click.self="isDetailOpen = false">
    <div class="w-full max-w-lg h-full bg-surface-container-lowest border-l-[3px] border-outline shadow-[-8px_0_0_#000000] overflow-y-auto p-6 flex flex-col gap-5">
      <div class="flex items-start justify-between">
        <div>
          <span :class="severityColors[detailBug.severity]" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px] mr-2">{{ detailBug.severity }}</span>
          <span :class="statusColors[detailBug.status]" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ detailBug.status }}</span>
          <h2 class="font-display text-xl font-black uppercase mt-3">{{ detailBug.title }}</h2>
        </div>
        <button @click="isDetailOpen = false" class="p-1 border-[2px] border-outline hover:bg-surface-dim">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div v-if="detailBug.description" class="border-[2px] border-outline p-3 bg-surface">
        <p class="font-label uppercase text-[10px] text-on-surface-variant mb-1">Description</p>
        <p class="text-sm font-body">{{ detailBug.description }}</p>
      </div>

      <div v-if="detailBug.project" class="flex items-center gap-2">
        <span class="font-label uppercase text-[10px] text-on-surface-variant">Project:</span>
        <span class="px-2 py-0.5 bg-[#93c5fd] border-[2px] border-outline font-label uppercase text-[10px]">{{ detailBug.project.name }}</span>
      </div>

      <!-- RCA Info -->
      <div class="border-[2px] border-outline bg-surface">
        <div class="p-3 border-b-[2px] border-outline flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">manage_search</span>
          <h3 class="font-headline uppercase text-sm">Root Cause Analysis</h3>
        </div>
        <div class="p-3 space-y-3">
          <div>
            <p class="font-label uppercase text-[10px] text-on-surface-variant mb-1">Category</p>
            <span v-if="detailBug.rootCauseCategory" :class="rcaColor(detailBug.rootCauseCategory)" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ rcaLabel(detailBug.rootCauseCategory) }}</span>
            <span v-else class="text-on-surface-variant text-[11px] italic">Not classified yet</span>
          </div>
          <div v-if="detailBug.rootCauseDescription">
            <p class="font-label uppercase text-[10px] text-on-surface-variant mb-1">Analysis Details</p>
            <p class="text-sm font-body whitespace-pre-wrap bg-surface-container p-3 border-[2px] border-outline">{{ detailBug.rootCauseDescription }}</p>
          </div>
          <div v-else class="text-on-surface-variant text-[11px] italic">No RCA details recorded yet. Edit this bug to add analysis.</div>
        </div>
      </div>

      <!-- Attachments -->
      <div class="border-[2px] border-outline bg-surface">
        <div class="p-3 border-b-[2px] border-outline flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">attach_file</span>
          <h3 class="font-headline uppercase text-sm">Log Attachments ({{ detailBug.logAttachments?.length || 0 }})</h3>
        </div>
        <div class="p-3">
          <div v-if="detailBug.logAttachments?.length" class="space-y-2">
            <div v-for="(att, idx) in detailBug.logAttachments" :key="idx"
              class="flex items-center justify-between p-2 border-[2px] border-outline bg-surface-container">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">description</span>
                <span class="font-label text-sm">{{ att.name }}</span>
              </div>
              <button @click="downloadAttachment(att)" class="px-2 py-1 bg-[#93c5fd] border-[2px] border-outline text-[10px] font-label uppercase">Download</button>
            </div>
          </div>
          <p v-else class="text-[11px] text-on-surface-variant italic">No log files attached.</p>
        </div>
      </div>

      <div class="flex gap-3">
        <button @click="openEdit(detailBug); isDetailOpen = false" class="flex-1 px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          Edit / Add RCA
        </button>
        <button @click="isDetailOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Close</button>
      </div>
    </div>
  </div>
</template>
