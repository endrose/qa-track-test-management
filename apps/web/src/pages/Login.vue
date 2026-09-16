<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  try {
    const res = await fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/')
    } else {
      const errData = await res.json().catch(() => ({}))
      error.value = errData.message || 'Invalid email or password'
    }
  } catch (err) {
    error.value = 'Server connection failed. Please make sure the backend is running.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex items-center gap-2 border-b-[2px] border-outline pb-4 mb-6">
      <span class="material-symbols-outlined text-[32px]">bug_report</span>
      <h1 class="font-display text-display tracking-tight uppercase leading-none">QATrack</h1>
    </div>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div v-if="error" class="bg-[#fca5a5] border-[2px] border-outline p-3 text-on-surface font-label uppercase">
        {{ error }}
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-label uppercase text-label">Email</label>
        <input v-model="email" type="email" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000000]" required />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-label uppercase text-label">Password</label>
        <input v-model="password" type="password" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000000]" required />
      </div>

      <button type="submit" :disabled="isLoading" class="w-full px-4 py-3 bg-primary text-on-primary font-label uppercase text-title border-[3px] border-outline shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <span v-if="isLoading" class="material-symbols-outlined text-[18px] animate-spin">refresh</span>
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>
