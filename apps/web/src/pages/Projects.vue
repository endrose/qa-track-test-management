<script setup lang="ts">
import { ref, onMounted } from 'vue'

const projects = ref([])
const isModalOpen = ref(false)
const newProjectName = ref('')
const newProjectDesc = ref('')

const fetchProjects = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/projects')
    if (res.ok) {
      projects.value = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch projects', error)
  }
}

const createProject = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newProjectName.value, description: newProjectDesc.value })
    })
    if (res.ok) {
      isModalOpen.value = false
      newProjectName.value = ''
      newProjectDesc.value = ''
      fetchProjects()
    }
  } catch (error) {
    console.error('Failed to create project', error)
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <div class="flex flex-col gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Projects</h1>
      <button @click="isModalOpen = true" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">add_circle</span> Create Project
      </button>
    </div>
  </div>

  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">ID</th>
            <th class="p-3 border-r-[2px] border-outline">Name</th>
            <th class="p-3 border-r-[2px] border-outline">Description</th>
            <th class="p-3">Created At</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="projects.length === 0">
            <td colspan="4" class="p-3 text-center">No projects found.</td>
          </tr>
          <tr v-for="proj in projects" :key="proj.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ proj.id }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ proj.name }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ proj.description }}</td>
            <td class="p-3">{{ new Date(proj.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline text-headline uppercase mb-4">New Project</h2>
      <form @submit.prevent="createProject" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Name</label>
          <input v-model="newProjectName" type="text" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none focus:ring-2 shadow-[2px_2px_0px_#000000]" required />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Description</label>
          <textarea v-model="newProjectDesc" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none focus:ring-2 shadow-[2px_2px_0px_#000000]" rows="3"></textarea>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>
