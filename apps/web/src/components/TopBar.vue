<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['toggle-sidebar'])

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

import { io } from 'socket.io-client'

const notifications = ref<any[]>([])
const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
const showNotifications = ref(false)
let socket: any = null

const fetchNotifications = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/notifications')
    if (res.ok) notifications.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch notifications', err)
  }
}

const markAsRead = async (id: string) => {
  try {
    await fetch(`http://127.0.0.1:3000/api/notifications/${id}/read`, { method: 'PUT' })
    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.isRead = true
  } catch (err) {}
}

const markAllAsRead = async () => {
  try {
    await fetch(`http://127.0.0.1:3000/api/notifications/read-all`, { method: 'PUT' })
    notifications.value.forEach(n => n.isRead = true)
  } catch (err) {}
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  fetchTestCases()
  fetchNotifications()

  // Socket.io connection
  socket = io('http://127.0.0.1:3000')
  socket.on('new-notification', (notif: any) => {
    notifications.value.unshift(notif)
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (socket) socket.disconnect()
})

const navigateToItem = (type: string) => {
  searchQuery.value = ''
  searchInput.value?.blur()
  if (type === 'project') router.push('/projects') // Adjust if you have a specific route
  else if (type === 'test-case') router.push('/test-cases')
}
</script>

<template>
  <header class="fixed top-0 left-0 lg:left-[250px] right-0 h-16 bg-surface border-b-[3px] border-outline z-40 flex items-center justify-between px-gutter gap-2">
    <!-- Hamburger on mobile -->
    <button
      class="lg:hidden p-1 border-[2px] border-outline bg-surface-container hover:bg-surface-container-highest transition-colors mr-1 flex-shrink-0"
      @click="emit('toggle-sidebar')"
    >
      <span class="material-symbols-outlined">menu</span>
    </button>
    <div class="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
      <div class="relative">
        <button
          @click="showProjectDropdown = !showProjectDropdown"
          class="flex items-center gap-2 px-2 md:px-3 py-1 bg-surface-container border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all max-w-[140px] md:max-w-none"
        >
          <span class="material-symbols-outlined text-[18px] flex-shrink-0">folder_open</span>
          <span class="font-bold text-body truncate">{{ selectedProject }}</span>
          <span class="material-symbols-outlined text-[18px] flex-shrink-0">expand_more</span>
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
            @blur="() => window.setTimeout(() => isSearchFocused = false, 200)"
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
      <div class="relative">
        <button 
          @click="showNotifications = !showNotifications"
          class="relative p-2 bg-surface border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          <span class="material-symbols-outlined text-[20px]">notifications</span>
          <span v-if="unreadCount > 0" class="absolute -top-2 -right-2 bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-outline shadow-[1px_1px_0px_#000000]">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </button>

        <div v-if="showNotifications" class="absolute right-0 top-full mt-2 w-80 bg-surface border-[3px] border-outline shadow-[4px_4px_0px_#000000] z-50 max-h-96 flex flex-col">
          <div class="flex items-center justify-between px-3 py-2 border-b-[2px] border-outline bg-surface-container">
            <span class="font-label uppercase text-label text-on-surface-variant">Notifications</span>
            <button v-if="unreadCount > 0" @click="markAllAsRead" class="text-[10px] font-bold text-primary hover:underline">Mark all read</button>
          </div>
          <div class="overflow-y-auto flex-1">
            <div v-if="notifications.length === 0" class="p-4 text-center text-sm text-on-surface-variant">
              No notifications
            </div>
            <div 
              v-for="notif in notifications" 
              :key="notif.id"
              class="px-3 py-3 border-b-[2px] border-outline hover:bg-surface-dim transition-colors cursor-pointer"
              :class="notif.isRead ? 'opacity-70' : 'bg-[#e0e7ff]'"
              @click="markAsRead(notif.id)"
            >
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[16px] mt-0.5" 
                  :class="notif.type === 'error' ? 'text-error' : notif.type === 'success' ? 'text-[#22c55e]' : 'text-primary'">
                  {{ notif.type === 'error' ? 'error' : notif.type === 'success' ? 'check_circle' : 'info' }}
                </span>
                <div class="flex-1">
                  <p class="font-bold text-sm leading-tight">{{ notif.title }}</p>
                  <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">{{ notif.message }}</p>
                  <p class="text-[10px] text-on-surface-variant mt-1">{{ new Date(notif.createdAt).toLocaleTimeString() }}</p>
                </div>
                <div v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-primary mt-1"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showNotifications" class="fixed inset-0 z-40" @click="showNotifications = false" />
      </div>

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
