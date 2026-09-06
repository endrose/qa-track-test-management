<script setup lang="ts">
import { ref, onMounted } from 'vue'

const testCases = ref<any[]>([])
const isModalOpen = ref(false)
const isEditOpen = ref(false)
const editTc = ref<any>(null)
const newTc = ref({ title: '', description: '', priority: 'Medium', status: 'Draft' })

const priorityColors: Record<string, string> = {
  'High': 'bg-[#fca5a5]',
  'Medium': 'bg-[#fde047]',
  'Low': 'bg-surface-container-highest',
}
const statusColors: Record<string, string> = {
  'Draft': 'bg-surface-container-highest',
  'Ready': 'bg-[#93c5fd]',
  'Passed': 'bg-[#86efac]',
  'Failed': 'bg-[#ef4444] text-white',
}

const fetchTestCases = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/test-cases')
    if (res.ok) testCases.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch test cases', err)
  }
}

const createTestCase = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/test-cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTc.value),
    })
    if (res.ok) {
      isModalOpen.value = false
      newTc.value = { title: '', description: '', priority: 'Medium', status: 'Draft' }
      fetchTestCases()
    }
  } catch (err) {
    console.error('Failed to create test case', err)
  }
}

const openEdit = (tc: any) => {
  editTc.value = { ...tc }
  isEditOpen.value = true
}

const updateTestCase = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/test-cases/${editTc.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editTc.value.title,
        description: editTc.value.description,
        priority: editTc.value.priority,
        status: editTc.value.status,
      }),
    })
    if (res.ok) {
      isEditOpen.value = false
      editTc.value = null
      fetchTestCases()
    }
  } catch (err) {
    console.error('Failed to update test case', err)
  }
}

const deleteTestCase = async (id: string) => {
  if (!confirm('Delete this test case?')) return
  await fetch(`http://localhost:3000/api/test-cases/${id}`, { method: 'DELETE' })
  fetchTestCases()
}

onMounted(fetchTestCases)
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Testing</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Test Cases</h1>
    </div>
    <button @click="isModalOpen = true" class="px-4 py-2 bg-[#86efac] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
      <span class="material-symbols-outlined text-[18px]">add_task</span> Create Test Case
    </button>
  </div>

  <!-- KPI Chips -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div v-for="s in ['Draft','Ready','Passed','Failed']" :key="s" :class="statusColors[s]" class="border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
      <span class="font-label uppercase text-label">{{ s }}</span>
      <span class="font-display text-display font-black">{{ testCases.filter(t => t.status === s).length }}</span>
    </div>
  </div>

  <!-- Table -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <h2 class="font-headline text-headline uppercase flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
      <span class="material-symbols-outlined">checklist</span> Test Case List
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">Title</th>
            <th class="p-3 border-r-[2px] border-outline">Priority</th>
            <th class="p-3 border-r-[2px] border-outline">Status</th>
            <th class="p-3 border-r-[2px] border-outline">Created</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="testCases.length === 0">
            <td colspan="5" class="p-4 text-center text-on-surface-variant">No test cases found.</td>
          </tr>
          <tr v-for="tc in testCases" :key="tc.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ tc.title }}</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="priorityColors[tc.priority] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ tc.priority }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="statusColors[tc.status] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ tc.status }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">{{ new Date(tc.createdAt).toLocaleDateString() }}</td>
            <td class="p-3 flex gap-2">
              <button @click="openEdit(tc)" class="px-2 py-1 bg-[#93c5fd] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Edit</button>
              <button @click="deleteTestCase(tc.id)" class="px-2 py-1 bg-[#fca5a5] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Create Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline text-headline uppercase mb-4">Create Test Case</h2>
      <form @submit.prevent="createTestCase" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Title</label>
          <input v-model="newTc.title" type="text" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" required />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Description</label>
          <textarea v-model="newTc.description" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" rows="3"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Priority</label>
            <select v-model="newTc.priority" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Status</label>
            <select v-model="newTc.status" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>Draft</option><option>Ready</option><option>Passed</option><option>Failed</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Save</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Edit Modal -->
  <div v-if="isEditOpen && editTc" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline text-headline uppercase mb-4">Edit Test Case</h2>
      <form @submit.prevent="updateTestCase" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Title</label>
          <input v-model="editTc.title" type="text" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" required />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label uppercase text-label">Description</label>
          <textarea v-model="editTc.description" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]" rows="3"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Priority</label>
            <select v-model="editTc.priority" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Status</label>
            <select v-model="editTc.status" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>Draft</option><option>Ready</option><option>Passed</option><option>Failed</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isEditOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>
