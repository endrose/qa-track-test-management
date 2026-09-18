<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showDropdown = ref(false)
const showProjectDropdown = ref(false)

const projects = ref<any[]>([])
const selectedProject = ref('Select Project')
const selectedProjectId = ref<string>('')

const switchProject = (project: any) => {
  selectedProject.value = project.name
  selectedProjectId.value = project.id
  showProjectDropdown.value = false
  // Simpan ke localStorage supaya page lain bisa baca
  localStorage.setItem('selectedProjectId', project.id)
  localStorage.setItem('selectedProjectName', project.name)
  // Kirim custom event agar halaman yang aktif bisa filter ulang
  window.dispatchEvent(new CustomEvent('project-switched', { detail: { id: project.id, name: project.name } }))
}

onMounted(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/projects')
    if (res.ok) {
      projects.value = await res.json()
      // Restore pilihan sebelumnya dari localStorage
      const savedId = localStorage.getItem('selectedProjectId')
      const savedName = localStorage.getItem('selectedProjectName')
      if (savedId && savedName && projects.value.find(p => p.id === savedId)) {
        selectedProject.value = savedName
        selectedProjectId.value = savedId
      } else if (projects.value.length > 0) {
        selectedProject.value = projects.value[0].name
        selectedProjectId.value = projects.value[0].id
        localStorage.setItem('selectedProjectId', projects.value[0].id)
        localStorage.setItem('selectedProjectName', projects.value[0].name)
      }
    }
  } catch (error) {
    console.error('Failed to fetch projects', error)
  }
})

const user = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
})

const userInitial = computed(() => {
  const name = user.value?.name || user.value?.email || 'U'
  return name.charAt(0).toUpperCase()
})

const userName = computed(() => user.value?.name || user.value?.email || 'User')

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  showDropdown.value = false
  router.push('/login')
}

// Search functionality
const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const isSearchFocused = ref(false)
const testCases = ref<any[]>([])

const fetchTestCases = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/test-cases')
    if (res.ok) testCases.value = await res.json()
  } catch (err) {}
}

const searchResults = computed(() => {
  if (!searchQuery.value) return { projects: [], testCases: [] }
  const query = searchQuery.value.toLowerCase()
  return {
    projects: projects.value.filter(p => p.name.toLowerCase().includes(query)),
    testCases: testCases.value.filter(t => t.title.toLowerCase().includes(query))
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
  if (e.key === 'Escape' && isSearchFocused.value) {
    searchInput.value?.blur()
    isSearchFocused.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  fetchTestCases()
})

import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const navigateToItem = (type: string) => {
  searchQuery.value = ''
  searchInput.value?.blur()
  if (type === 'project') router.push('/projects') // Adjust if you have a specific route
  else if (type === 'test-case') router.push('/test-cases')
}
</script>

<template>
  <header class="fixed top-0 left-[250px] right-0 h-16 bg-surface border-b-[3px] border-outline z-40 flex items-center justify-between px-gutter">
    <div class="flex items-center gap-4">
      <div class="relative">
        <button 
          @click="showProjectDropdown = !showProjectDropdown"
          class="flex items-center gap-2 px-3 py-1 bg-surface-container border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          <span class="material-symbols-outlined text-[18px]">folder_open</span>
          <span class="font-bold text-body">{{ selectedProject }}</span>
          <span class="material-symbols-outlined text-[18px]">expand_more</span>
        </button>

        <div 
          v-if="showProjectDropdown"
          class="absolute left-0 top-full mt-2 w-56 bg-surface border-[3px] border-outline shadow-[4px_4px_0px_#000000] z-50"
        >
          <div class="px-3 py-2 border-b-[2px] border-outline bg-surface-container">
            <span class="font-label uppercase text-label text-on-surface-variant">Switch Project</span>
          </div>
          <button 
            v-for="project in projects" 
            :key="project.id"
            @click="switchProject(project)"
            class="w-full text-left px-3 py-2 text-body font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-between"
          >
            {{ project.name }}
            <span v-if="selectedProjectId === project.id" class="material-symbols-outlined text-[16px]">check</span>
          </button>
        </div>

        <div 
          v-if="showProjectDropdown"
          class="fixed inset-0 z-40"
          @click="showProjectDropdown = false"
        />
      </div>

      <div class="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed font-label uppercase border-[2px] border-outline">
        QA
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative">
        <div 
          class="flex items-center gap-2 px-3 py-1 bg-surface border-[2px] border-outline shadow-[2px_2px_0px_#000000] w-64 transition-all"
          :class="isSearchFocused ? 'ring-2 ring-primary border-primary shadow-none translate-x-[2px] translate-y-[2px]' : ''"
        >
          <span class="material-symbols-outlined text-[18px]" :class="isSearchFocused ? 'text-primary' : 'text-on-surface-variant'">search</span>
          <input 
            ref="searchInput"
            v-model="searchQuery"
            @focus="isSearchFocused = true"
            @blur="setTimeout(() => isSearchFocused = false, 200)"
            type="text" 
            placeholder="Search..." 
            class="text-body flex-1 bg-transparent outline-none text-on-surface" 
          />
          <span class="px-1.5 py-0.5 bg-surface-dim border-[1px] border-outline text-[10px] font-mono text-on-surface-variant">Ctrl K</span>
        </div>

        <!-- Search Results Dropdown -->
        <div 
          v-if="isSearchFocused && searchQuery"
          class="absolute left-0 right-0 top-full mt-2 bg-surface border-[3px] border-outline shadow-[4px_4px_0px_#000000] z-50 max-h-96 overflow-y-auto"
        >
          <!-- Projects -->
          <div v-if="searchResults.projects.length > 0" class="mb-2">
            <div class="px-3 py-1.5 bg-surface-dim border-b-[2px] border-outline font-label uppercase text-[10px]">Projects</div>
            <button 
              v-for="p in searchResults.projects" 
              :key="'p-'+p.id"
              @click="navigateToItem('project')"
              class="w-full text-left px-3 py-2 hover:bg-[#93c5fd] transition-colors flex flex-col"
            >
              <span class="font-bold text-sm truncate">{{ p.name }}</span>
            </button>
          </div>
          
          <!-- Test Cases -->
          <div v-if="searchResults.testCases.length > 0">
            <div class="px-3 py-1.5 bg-surface-dim border-y-[2px] border-outline font-label uppercase text-[10px]">Test Cases</div>
            <button 
              v-for="tc in searchResults.testCases" 
              :key="'tc-'+tc.id"
              @click="navigateToItem('test-case')"
              class="w-full text-left px-3 py-2 hover:bg-[#86efac] transition-colors flex flex-col"
            >
              <span class="font-bold text-sm truncate">{{ tc.title }}</span>
              <span class="text-[10px] font-label text-on-surface-variant uppercase">{{ tc.status }} • {{ tc.testType }}</span>
            </button>
          </div>

          <div v-if="searchResults.projects.length === 0 && searchResults.testCases.length === 0" class="p-4 text-center text-sm text-on-surface-variant">
            No results found for "{{ searchQuery }}"
          </div>
        </div>
      </div>
      <button class="p-2 bg-surface border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
        <span class="material-symbols-outlined text-[20px]">notifications</span>
      </button>

      <!-- User avatar + dropdown -->
      <div class="relative">
        <button
          id="user-menu-btn"
          @click="showDropdown = !showDropdown"
          class="flex items-center gap-2 px-2 py-1 bg-surface border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          <div class="w-7 h-7 bg-primary border-[2px] border-outline flex items-center justify-center text-on-primary font-bold text-sm">
            {{ userInitial }}
          </div>
          <span class="font-label text-body hidden sm:block max-w-[100px] truncate">{{ userName }}</span>
          <span class="material-symbols-outlined text-[18px]">expand_more</span>
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="showDropdown"
          class="absolute right-0 top-full mt-2 w-48 bg-surface border-[3px] border-outline shadow-[4px_4px_0px_#000000] z-50"
        >
          <div class="px-4 py-3 border-b-[2px] border-outline">
            <p class="font-label uppercase text-label text-on-surface-variant">Logged in as</p>
            <p class="font-bold text-body truncate">{{ userName }}</p>
          </div>
          <button
            id="logout-btn"
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-error hover:text-on-error transition-colors font-label uppercase text-body"
          >
            <span class="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>

        <!-- Backdrop to close dropdown -->
        <div
          v-if="showDropdown"
          class="fixed inset-0 z-40"
          @click="showDropdown = false"
        />
      </div>
    </div>
  </header>
</template>
