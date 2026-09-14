<script setup lang="ts">
import { ref, onMounted } from 'vue'

const bugs = ref<any[]>([])
const projects = ref<any[]>([])
const isModalOpen = ref(false)
const isEditOpen = ref(false)
const editBug = ref<any>(null)
const newBug = ref({ title: '', description: '', severity: 'Major', status: 'Open', projectId: '' })

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

const fetchBugs = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/bugs')
    if (res.ok) bugs.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch bugs', err)
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

const createBug = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/bugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newBug.value,
        project: newBug.value.projectId ? { id: newBug.value.projectId } : null
      }),
    })
    if (res.ok) {
      isModalOpen.value = false
      newBug.value = { title: '', description: '', severity: 'Major', status: 'Open', projectId: '' }
      fetchBugs()
    }
  } catch (err) {
    console.error('Failed to create bug', err)
  }
}

const openEdit = (bug: any) => {
  editBug.value = { ...bug, projectId: bug.project?.id || '' }
  isEditOpen.value = true
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
        project: editBug.value.projectId ? { id: editBug.value.projectId } : null,
      }),
    })
    if (res.ok) {
      isEditOpen.value = false
      editBug.value = null
      fetchBugs()
    }
  } catch (err) {
    console.error('Failed to update bug', err)
  }
}

const deleteBug = async (id: string) => {
  if (!confirm('Delete this bug?')) return
  await fetch(`http://127.0.0.1:3000/api/bugs/${id}`, { method: 'DELETE' })
  fetchBugs()
}

onMounted(() => {
  fetchBugs()
  fetchProjects()
})
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

  <!-- Table -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <h2 class="font-headline text-headline uppercase flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
      <span class="material-symbols-outlined">pest_control</span> Bug List
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">Title</th>
            <th class="p-3 border-r-[2px] border-outline">Project</th>
            <th class="p-3 border-r-[2px] border-outline">Severity</th>
            <th class="p-3 border-r-[2px] border-outline">Status</th>
            <th class="p-3 border-r-[2px] border-outline">Created</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="bugs.length === 0">
            <td colspan="5" class="p-4 text-center text-on-surface-variant">No bugs found.</td>
          </tr>
          <tr v-for="bug in bugs" :key="bug.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ bug.title }}</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span v-if="bug.project" class="px-2 py-0.5 bg-[#93c5fd] border-[2px] border-outline font-label uppercase text-[10px]">{{ bug.project.name }}</span>
              <span v-else class="text-on-surface-variant text-[10px]">—</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="severityColors[bug.severity] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ bug.severity }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="statusColors[bug.status] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ bug.status }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">{{ new Date(bug.createdAt).toLocaleDateString() }}</td>
            <td class="p-3 flex gap-2">
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

  <!-- Edit Modal -->
  <div v-if="isEditOpen && editBug" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline text-headline uppercase mb-4">Edit Bug</h2>
      <form @submit.prevent="updateBug" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Title</label>
          <input v-model="editBug.title" type="text" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" required />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Description</label>
          <textarea v-model="editBug.description" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" rows="3"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
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
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Project</label>
          <select v-model="editBug.projectId" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
            <option value="">— None —</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isEditOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>
