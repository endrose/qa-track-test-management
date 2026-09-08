<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showDropdown = ref(false)
const showProjectDropdown = ref(false)

const projects = ref<any[]>([])
const selectedProject = ref('Select Project')

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/projects')
    if (res.ok) {
      projects.value = await res.json()
      if (projects.value.length > 0) {
        selectedProject.value = projects.value[0].name
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
            @click="selectedProject = project.name; showProjectDropdown = false"
            class="w-full text-left px-3 py-2 text-body font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-between"
          >
            {{ project.name }}
            <span v-if="selectedProject === project.name" class="material-symbols-outlined text-[16px]">check</span>
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
      <div class="flex items-center gap-2 px-3 py-1 bg-surface border-[2px] border-outline shadow-[2px_2px_0px_#000000] w-64 text-on-surface-variant">
        <span class="material-symbols-outlined text-[18px]">search</span>
        <input type="text" placeholder="Search..." class="text-body flex-1 bg-transparent outline-none text-on-surface" />
        <span class="px-1.5 py-0.5 bg-surface-dim border-[1px] border-outline text-label">Ctrl + K</span>
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
