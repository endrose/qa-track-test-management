<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const activeTab = ref<'profile' | 'team' | 'notifications' | 'integrations'>('profile')

const user = computed(() => {
  try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
})

// Profile form
const profileForm = ref({ name: '', email: '', role: '' })
const profileSaved = ref(false)

// Team members real data
const teamMembers = ref<any[]>([])
const inviteEmail = ref('')
const inviteRole = ref('Tester')

// Notification settings
const notifications = ref({
  emailOnTestFail: true,
  emailOnBugCreated: true,
  emailOnBugResolved: false,
  slackEnabled: false,
  slackWebhook: '',
  dailyDigest: true,
})

// Integration settings
const integrations = ref({
  jiraUrl: '',
  jiraToken: '',
  githubRepo: '',
  githubToken: '',
  slackWebhook: '',
})

const roles = ['Admin', 'QA Lead', 'Tester', 'Developer', 'Viewer']

const fetchUsers = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/users')
    if (res.ok) {
      teamMembers.value = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch users', error)
  }
}

onMounted(() => {
  profileForm.value.name = user.value.name || ''
  profileForm.value.email = user.value.email || ''
  profileForm.value.role = user.value.role || ''
  fetchUsers()
})

const saveProfile = () => {
  profileSaved.value = true
  setTimeout(() => { profileSaved.value = false }, 3000)
}

const inviteMember = async () => {
  if (!inviteEmail.value) return
  
  try {
    const res = await fetch('http://localhost:3000/api/auth/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail.value, role: inviteRole.value }),
    })
    
    if (res.ok) {
      inviteEmail.value = ''
      fetchUsers()
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to invite user')
    }
  } catch (error) {
    console.error('Failed to invite user', error)
  }
}

const removeMember = async (id: string) => {
  if (confirm('Are you sure you want to remove this member?')) {
    try {
      await fetch(`http://localhost:3000/api/auth/users/${id}`, { method: 'DELETE' })
      fetchUsers()
    } catch (error) {
      console.error('Failed to remove user', error)
    }
  }
}

const statusColor: Record<string, string> = {
  Active: 'bg-[#86efac]', Inactive: 'bg-surface-container-highest', Pending: 'bg-[#fde047]'
}
</script>

<template>
  <!-- Header -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex items-center gap-2 mb-1">
      <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline">Admin</span>
    </div>
    <h1 class="font-display text-display uppercase tracking-tight">Settings</h1>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
    <!-- Sidebar Tabs -->
    <div class="lg:col-span-1">
      <nav class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] overflow-hidden">
        <button
          v-for="tab in (['profile', 'team', 'notifications', 'integrations'] as const)"
          :key="tab"
          @click="activeTab = tab"
          class="w-full flex items-center gap-3 px-4 py-3 border-b-[2px] border-outline font-label uppercase transition-all"
          :class="activeTab === tab ? 'bg-primary text-on-primary shadow-[inset_4px_0_0_#000000]' : 'hover:bg-surface-container'"
        >
          <span class="material-symbols-outlined text-[20px]">
            {{ tab === 'profile' ? 'person' : tab === 'team' ? 'group' : tab === 'notifications' ? 'notifications' : 'integration_instructions' }}
          </span>
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- Content -->
    <div class="lg:col-span-3">

      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
        <h2 class="font-headline text-headline uppercase border-b-[2px] border-outline pb-3 mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined">person</span> Profile Settings
        </h2>
        <div v-if="profileSaved" class="bg-[#86efac] border-[2px] border-outline p-3 font-label uppercase mb-4">
          ✓ Profile saved successfully!
        </div>
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="font-label uppercase text-label block mb-1">Full Name</label>
            <input v-model="profileForm.name" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000000]" />
          </div>
          <div>
            <label class="font-label uppercase text-label block mb-1">Email</label>
            <input v-model="profileForm.email" type="email" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000000]" />
          </div>
          <div>
            <label class="font-label uppercase text-label block mb-1">Role</label>
            <input v-model="profileForm.role" disabled class="w-full px-3 py-2 bg-surface-dim border-[2px] border-outline text-on-surface-variant cursor-not-allowed" />
          </div>
          <div class="pt-4 border-t-[2px] border-outline">
            <label class="font-label uppercase text-label block mb-2">Change Password</label>
            <div class="space-y-2">
              <input type="password" placeholder="Current password" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000000]" />
              <input type="password" placeholder="New password" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000000]" />
            </div>
          </div>
          <button type="submit" class="px-6 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Save Changes</button>
        </form>
      </div>

      <!-- Team Tab -->
      <div v-if="activeTab === 'team'" class="space-y-4">
        <!-- Invite -->
        <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
          <h2 class="font-headline text-headline uppercase border-b-[2px] border-outline pb-3 mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">person_add</span> Invite Member
          </h2>
          <div class="flex gap-3 flex-wrap">
            <input v-model="inviteEmail" type="email" placeholder="Email address" class="flex-1 min-w-[200px] px-3 py-2 bg-surface border-[2px] border-outline outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000000]" />
            <select v-model="inviteRole" class="px-3 py-2 bg-surface border-[2px] border-outline outline-none shadow-[2px_2px_0px_#000000] font-label">
              <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
            </select>
            <button @click="inviteMember" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">send</span> Invite
            </button>
          </div>
        </div>
        <!-- Team List -->
        <div class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000]">
          <div class="p-4 border-b-[2px] border-outline">
            <h2 class="font-headline text-headline uppercase flex items-center gap-2"><span class="material-symbols-outlined">group</span> Team Members ({{ teamMembers.length }})</h2>
          </div>
          <div class="divide-y-[2px] divide-outline">
            <div v-for="m in teamMembers" :key="m.id" class="flex items-center justify-between p-4 hover:bg-surface-container transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-primary border-[2px] border-outline flex items-center justify-center text-on-primary font-bold">{{ m.name.charAt(0) }}</div>
                <div>
                  <div class="font-bold text-body">{{ m.name }}</div>
                  <div class="text-label text-on-surface-variant">{{ m.email }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-label text-[10px] uppercase px-2 py-0.5 bg-surface-container border-[2px] border-outline">{{ m.role }}</span>
                <span class="font-label text-[10px] uppercase px-2 py-0.5 border-[2px] border-outline" :class="statusColor[m.status]">{{ m.status }}</span>
                <button @click="removeMember(m.id)" class="p-1 border-[2px] border-outline hover:bg-error hover:text-on-error transition-colors">
                  <span class="material-symbols-outlined text-[16px]">person_remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-if="activeTab === 'notifications'" class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
        <h2 class="font-headline text-headline uppercase border-b-[2px] border-outline pb-3 mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined">notifications</span> Notification Preferences
        </h2>
        <div class="space-y-4">
          <div v-for="(val, key) in notifications" :key="key" class="flex items-center justify-between py-3 border-b-[2px] border-outline last:border-0">
            <template v-if="typeof val === 'boolean'">
              <span class="font-label uppercase">{{ key.replace(/([A-Z])/g, ' $1') }}</span>
              <button
                @click="(notifications as any)[key] = !(notifications as any)[key]"
                class="w-12 h-6 border-[2px] border-outline relative transition-all"
                :class="val ? 'bg-primary' : 'bg-surface-container'"
              >
                <span class="absolute top-0.5 w-4 h-4 bg-on-primary border-[1px] border-outline transition-all" :class="val ? 'left-6 bg-surface' : 'left-0.5 bg-on-surface'"></span>
              </button>
            </template>
            <template v-else>
              <span class="font-label uppercase">{{ key.replace(/([A-Z])/g, ' $1') }}</span>
              <input :value="val" @input="(notifications as any)[key] = ($event.target as HTMLInputElement).value" placeholder="Enter webhook URL..." class="flex-1 max-w-xs ml-4 px-3 py-1 bg-surface border-[2px] border-outline outline-none text-body" />
            </template>
          </div>
        </div>
        <button class="mt-4 px-6 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Save Preferences</button>
      </div>

      <!-- Integrations Tab -->
      <div v-if="activeTab === 'integrations'" class="space-y-4">
        <div v-for="(section, name) in { Jira: { url: integrations.jiraUrl, token: integrations.jiraToken, icon: 'link', color: 'bg-[#93c5fd]' }, GitHub: { url: integrations.githubRepo, token: integrations.githubToken, icon: 'code', color: 'bg-surface-container-highest' } }" :key="name" class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
          <h2 class="font-headline text-headline uppercase border-b-[2px] border-outline pb-3 mb-4 flex items-center gap-3">
            <span :class="section.color" class="p-1 border-[2px] border-outline"><span class="material-symbols-outlined">{{ section.icon }}</span></span>
            {{ name }} Integration
          </h2>
          <div class="space-y-3">
            <div>
              <label class="font-label uppercase text-label block mb-1">{{ name === 'Jira' ? 'Jira URL' : 'Repository (owner/repo)' }}</label>
              <input :value="section.url" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none shadow-[2px_2px_0px_#000000]" :placeholder="name === 'Jira' ? 'https://yourorg.atlassian.net' : 'owner/repository'" />
            </div>
            <div>
              <label class="font-label uppercase text-label block mb-1">API Token</label>
              <input type="password" :value="section.token" class="w-full px-3 py-2 bg-surface border-[2px] border-outline outline-none shadow-[2px_2px_0px_#000000]" placeholder="••••••••••••" />
            </div>
            <button class="px-6 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Connect {{ name }}</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
