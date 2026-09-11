<script setup lang="ts">
import { ref, onMounted } from 'vue'

const requirements = ref<any[]>([])
const projects = ref<any[]>([])
const isModalOpen = ref(false)
const newReq = ref({ title: '', description: '', projectId: '' })

const fetchRequirements = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/requirements')
    if (res.ok) requirements.value = await res.json()
  } catch (error) {
    console.error('Failed to fetch requirements', error)
  }
}

const fetchProjects = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/projects')
    if (res.ok) projects.value = await res.json()
  } catch (error) {
    console.error('Failed to fetch projects', error)
  }
}

const createRequirement = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/requirements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newReq.value.title,
        description: newReq.value.description,
        project: newReq.value.projectId ? { id: newReq.value.projectId } : null
      })
    })
    if (res.ok) {
      isModalOpen.value = false
      newReq.value = { title: '', description: '', projectId: '' }
      fetchRequirements()
    }
  } catch (error) {
    console.error('Failed to create requirement', error)
  }
}

const deleteRequirement = async (id: string) => {
  if (!confirm('Delete this requirement?')) return
  await fetch(`http://localhost:3000/api/requirements/${id}`, { method: 'DELETE' })
  fetchRequirements()
}

onMounted(() => {
  fetchRequirements()
  fetchProjects()
})
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-[#93c5fd] text-on-surface font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Requirements</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Requirements</h1>
    </div>
    <button @click="isModalOpen = true" class="px-4 py-2 bg-[#93c5fd] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
      <span class="material-symbols-outlined text-[18px]">post_add</span> Add Requirement
    </button>
  </div>

  <!-- KPI -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div v-for="s in ['Draft','Active','Done','Rejected']" :key="s" class="border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between bg-surface-container-lowest">
      <span class="font-label uppercase text-label">{{ s }}</span>
      <span class="font-display text-display font-black">{{ requirements.filter(r => r.status === s).length }}</span>
    </div>
  </div>

  <!-- Table -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <h2 class="font-headline text-headline uppercase flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
      <span class="material-symbols-outlined">assignment</span> Requirement List
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">Title</th>
            <th class="p-3 border-r-[2px] border-outline">Project</th>
            <th class="p-3 border-r-[2px] border-outline">Status</th>
            <th class="p-3 border-r-[2px] border-outline">Description</th>
            <th class="p-3 border-r-[2px] border-outline">Created</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="requirements.length === 0">
            <td colspan="6" class="p-4 text-center text-on-surface-variant">No requirements found.</td>
          </tr>
          <tr v-for="req in requirements" :key="req.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ req.title }}</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span v-if="req.project" class="px-2 py-0.5 bg-[#a78bfa] text-white font-label uppercase text-[10px] border-[2px] border-outline">{{ req.project.name }}</span>
              <span v-else class="text-on-surface-variant text-[11px]">—</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">
              <span class="px-2 py-0.5 bg-surface-container-highest font-label uppercase text-[10px] border-[2px] border-outline">{{ req.status }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline text-on-surface-variant text-sm">{{ req.description || '—' }}</td>
            <td class="p-3 border-r-[2px] border-outline text-sm">{{ new Date(req.createdAt).toLocaleDateString() }}</td>
            <td class="p-3">
              <button @click="deleteRequirement(req.id)" class="px-2 py-1 bg-[#fca5a5] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Create Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline text-headline uppercase mb-4">New Requirement</h2>
      <form @submit.prevent="createRequirement" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Title</label>
          <input v-model="newReq.title" type="text" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" required />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Description</label>
          <textarea v-model="newReq.description" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" rows="3"></textarea>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Project</label>
          <select v-model="newReq.projectId" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
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
</template>
