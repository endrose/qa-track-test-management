<script setup lang="ts">
import { ref, onMounted } from 'vue'

const requirements = ref([])
const isModalOpen = ref(false)
const newReqTitle = ref('')
const newReqDesc = ref('')

const fetchRequirements = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/requirements')
    if (res.ok) {
      requirements.value = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch requirements', error)
  }
}

const createRequirement = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/requirements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newReqTitle.value, description: newReqDesc.value })
    })
    if (res.ok) {
      isModalOpen.value = false
      newReqTitle.value = ''
      newReqDesc.value = ''
      fetchRequirements()
    }
  } catch (error) {
    console.error('Failed to create requirement', error)
  }
}

onMounted(() => {
  fetchRequirements()
})
</script>

<template>
  <div class="flex flex-col gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Requirements</h1>
      <button @click="isModalOpen = true" class="px-4 py-2 bg-[#93c5fd] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">post_add</span> Add Requirement
      </button>
    </div>
  </div>

  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">ID</th>
            <th class="p-3 border-r-[2px] border-outline">Title</th>
            <th class="p-3 border-r-[2px] border-outline">Status</th>
            <th class="p-3 border-r-[2px] border-outline">Description</th>
            <th class="p-3">Created At</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="requirements.length === 0">
            <td colspan="5" class="p-3 text-center">No requirements found.</td>
          </tr>
          <tr v-for="req in requirements" :key="req.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ req.id }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ req.title }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ req.status }}</td>
            <td class="p-3 border-r-[2px] border-outline">{{ req.description }}</td>
            <td class="p-3">{{ new Date(req.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline text-headline uppercase mb-4">New Requirement</h2>
      <form @submit.prevent="createRequirement" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Title</label>
          <input v-model="newReqTitle" type="text" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none focus:ring-2 shadow-[2px_2px_0px_#000000]" required />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Description</label>
          <textarea v-model="newReqDesc" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none focus:ring-2 shadow-[2px_2px_0px_#000000]" rows="3"></textarea>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>
