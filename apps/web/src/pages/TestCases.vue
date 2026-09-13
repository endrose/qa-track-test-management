<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const testCases = ref<any[]>([])
const projects = ref<any[]>([])
const filterProjectId = ref('')
const isModalOpen = ref(false)
const isEditOpen = ref(false)
const editTc = ref<any>(null)
const newTc = ref({ 
  title: '', description: '', priority: 'Medium', status: 'Draft', projectId: '', testType: 'Functional',
  automationType: 'none', automationTool: 'playwright', automationScript: '', automationConfig: ''
})

// Step Builder State
const builderSteps = ref<any[]>([{ action: 'navigate', url: '', selectorType: 'locator', selector: '', value: '' }])
const isGeneratingScript = ref(false)
const scannedSelectors = ref<string[]>([])
const isScanning = ref(false)

const handleScanUrl = async (url: string) => {
  if (!url) return alert('Please enter a valid URL first.')
  isScanning.value = true
  try {
    const res = await fetch(`http://localhost:3000/api/automation/scan-url?url=${encodeURIComponent(url)}`)
    if (res.ok) {
      scannedSelectors.value = await res.json()
      alert(`Scanned successfully! Found ${scannedSelectors.value.length} potential selectors.`)
    } else {
      throw new Error('Failed to scan')
    }
  } catch (err) {
    alert('Failed to scan URL. Ensure it is reachable.')
  } finally {
    isScanning.value = false
  }
}

const addStep = () => builderSteps.value.push({ action: 'click', url: '', selectorType: 'locator', selector: '', value: '' })
const removeStep = (index: number) => builderSteps.value.splice(index, 1)

const handleGenerateScript = async (tcObj: any) => {
  if (!tcObj.title) return alert('Please enter a title for the test case first.')
  isGeneratingScript.value = true
  try {
    const project = projects.value.find(p => p.id === tcObj.projectId)
    const res = await fetch('http://localhost:3000/api/automation/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: tcObj.title,
        projectName: project ? project.name : 'Test Suite',
        steps: builderSteps.value
      })
    })
    const data = await res.json()
    tcObj.automationScript = data.filename
    tcObj.automationType = 'script' // Switch back to script mapping automatically
    alert(`Script generated successfully!\nPath: ${data.filename}`)
  } catch (err) {
    console.error(err)
    alert('Failed to generate script')
  } finally {
    isGeneratingScript.value = false
  }
}

// Manage Scripts state
const isScriptsModalOpen = ref(false)
const availableScripts = ref<string[]>([])
const scriptsFramework = ref('playwright')

const fetchScripts = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/automation/scripts?framework=${scriptsFramework.value}`)
    if (res.ok) availableScripts.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch scripts', err)
  }
}

const openScriptsModal = () => {
  isScriptsModalOpen.value = true
  fetchScripts()
}

const deleteScript = async (filename: string) => {
  if (!confirm(`Delete ${filename}? This action cannot be undone.`)) return
  try {
    await fetch(`http://localhost:3000/api/automation/scripts/${filename}?framework=${scriptsFramework.value}`, { method: 'DELETE' })
    fetchScripts()
  } catch (err) {
    console.error('Failed to delete script', err)
  }
}

const editingScript = ref<{ filename: string; content: string } | null>(null)
const isSavingScript = ref(false)

const editScript = async (filename: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/automation/scripts/${filename}?framework=${scriptsFramework.value}`)
    if (res.ok) {
      const data = await res.json()
      editingScript.value = { filename, content: data.content }
    }
  } catch (err) {
    console.error('Failed to load script', err)
  }
}

const saveScript = async () => {
  if (!editingScript.value) return
  isSavingScript.value = true
  try {
    const res = await fetch(`http://localhost:3000/api/automation/scripts/${editingScript.value.filename}?framework=${scriptsFramework.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editingScript.value.content })
    })
    if (res.ok) {
      editingScript.value = null
    }
  } catch (err) {
    console.error('Failed to save script', err)
  } finally {
    isSavingScript.value = false
  }
}

const cancelEditScript = () => {
  editingScript.value = null
}

// Execution progress state
const executionState = ref<'idle' | 'running' | 'passed' | 'failed'>('idle')
const executionTcTitle = ref('')
const executionLog = ref('')
const showExecutionPanel = ref(false)
let pollInterval: any = null

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

const filteredTestCases = computed(() => {
  if (!filterProjectId.value) return testCases.value
  return testCases.value.filter(tc => tc.project?.id === filterProjectId.value)
})

const fetchTestCases = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/test-cases')
    if (res.ok) testCases.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch test cases', err)
  }
}

const fetchProjects = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/projects')
    if (res.ok) projects.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch projects', err)
  }
}

const createTestCase = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/test-cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newTc.value,
        project: newTc.value.projectId ? { id: newTc.value.projectId } : null,
        automationConfig: newTc.value.automationType === 'data-driven' && newTc.value.automationConfig ? JSON.parse(newTc.value.automationConfig) : null
      }),
    })
    if (res.ok) {
      isModalOpen.value = false
      newTc.value = { title: '', description: '', priority: 'Medium', status: 'Draft', projectId: '', testType: 'Functional', automationType: 'none', automationTool: 'playwright', automationScript: '', automationConfig: '' }
      fetchTestCases()
    }
  } catch (err) {
    console.error('Failed to create test case', err)
  }
}

const openEdit = (tc: any) => {
  editTc.value = { 
    ...tc, 
    projectId: tc.project?.id || '',
    automationConfig: tc.automationConfig ? JSON.stringify(tc.automationConfig, null, 2) : ''
  }
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
        testType: editTc.value.testType,
        project: editTc.value.projectId ? { id: editTc.value.projectId } : null,
        automationType: editTc.value.automationType,
        automationTool: editTc.value.automationTool,
        automationScript: editTc.value.automationScript,
        automationConfig: editTc.value.automationType === 'data-driven' && editTc.value.automationConfig ? JSON.parse(editTc.value.automationConfig) : null
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

const executeAutomation = async (tc: any) => {
  if (tc.automationType === 'none') return alert('Test case is not configured for automation.')
  
  executionTcTitle.value = tc.title
  executionState.value = 'running'
  executionLog.value = ''
  showExecutionPanel.value = true

  // Start polling automation runs to show live progress
  let runId: string | null = null
  pollInterval = setInterval(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/automation')
      if (res.ok) {
        const runs = await res.json()
        const latestRun = runs.find((r: any) => r.suiteName === tc.title)
        if (latestRun) {
          runId = latestRun.id
          executionLog.value = latestRun.log || 'Running tests...'
          if (latestRun.status !== 'Running') {
            clearInterval(pollInterval)
            executionState.value = latestRun.status.toLowerCase() === 'passed' ? 'passed' : 'failed'
            fetchTestCases()
          }
        }
      }
    } catch(e) { /* ignore poll errors */ }
  }, 2000)

  try {
    const res = await fetch(`http://localhost:3000/api/automation/test-cases/${tc.id}/execute`, { method: 'POST' })
    const data = await res.json()
    clearInterval(pollInterval)
    executionState.value = data.status?.toLowerCase() === 'passed' ? 'passed' : 'failed'
    executionLog.value = data.log || ''
    fetchTestCases()
  } catch (err) {
    clearInterval(pollInterval)
    executionState.value = 'failed'
    executionLog.value = String(err)
  }
}

const closeExecutionPanel = () => {
  if (executionState.value === 'running') {
    if (!confirm('Test is still running. Close panel anyway?')) return
    clearInterval(pollInterval)
  }
  showExecutionPanel.value = false
  executionState.value = 'idle'
  executionLog.value = ''
}

onMounted(() => {
  fetchTestCases()
  fetchProjects()
})

onUnmounted(() => {
  clearInterval(pollInterval)
})
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Testing</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Test Cases</h1>
    </div>
    <div class="flex items-center gap-3">
      <select v-model="filterProjectId" class="px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000] text-sm">
        <option value="">All Projects</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <button @click="openScriptsModal" class="px-3 py-2 bg-surface border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 font-label uppercase text-xs">
        <span class="material-symbols-outlined text-[16px]">folder_managed</span> Scripts
      </button>
      <button @click="isModalOpen = true" class="px-4 py-2 bg-[#86efac] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 text-xs">
        <span class="material-symbols-outlined text-[16px]">add_task</span> Create
      </button>
    </div>
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
      <span class="ml-auto font-label text-label text-on-surface-variant">{{ filteredTestCases.length }} cases</span>
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">Title</th>
            <th class="p-3 border-r-[2px] border-outline">Project</th>
            <th class="p-3 border-r-[2px] border-outline">Test Type</th>
            <th class="p-3 border-r-[2px] border-outline">Priority</th>
            <th class="p-3 border-r-[2px] border-outline">Status</th>
            <th class="p-3 border-r-[2px] border-outline">Automation</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="filteredTestCases.length === 0">
            <td colspan="7" class="p-4 text-center text-on-surface-variant">No test cases found.</td>
          </tr>
          <tr v-for="tc in filteredTestCases" :key="tc.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ tc.title }}</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span v-if="tc.project" class="px-2 py-0.5 bg-[#a78bfa] text-white font-label uppercase text-[10px] border-[2px] border-outline">{{ tc.project.name }}</span>
              <span v-else class="text-on-surface-variant text-[11px]">—</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline font-label uppercase text-[10px]">{{ tc.testType || 'Functional' }}</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="priorityColors[tc.priority] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ tc.priority }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">
              <span :class="statusColors[tc.status] || 'bg-surface-dim'" class="px-2 py-0.5 border-[2px] border-outline font-label uppercase text-[10px]">{{ tc.status }}</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline">
              <span v-if="tc.automationType !== 'none'" class="flex items-center gap-1 text-[10px] font-label uppercase">
                <span class="material-symbols-outlined text-[12px] text-[#86efac]">smart_toy</span>
                {{ tc.automationTool }} · {{ tc.automationScript }}
              </span>
              <span v-else class="text-on-surface-variant text-[11px]">Manual</span>
            </td>
            <td class="p-3 flex gap-2 flex-wrap">
              <button @click="openEdit(tc)" class="px-2 py-1 bg-[#93c5fd] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Edit</button>
              <button @click="deleteTestCase(tc.id)" class="px-2 py-1 bg-[#fca5a5] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Delete</button>
              <button v-if="tc.automationType !== 'none'" @click="executeAutomation(tc)" :disabled="executionState === 'running'" class="px-2 py-1 bg-[#fde047] text-on-surface font-label uppercase text-[10px] border-[2px] border-outline hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50 flex items-center gap-1">
                <span class="material-symbols-outlined text-[10px]">play_arrow</span> Run
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Execution Progress Panel -->
  <div v-if="showExecutionPanel" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div class="w-full max-w-2xl bg-surface-container-lowest border-[3px] border-outline shadow-[8px_8px_0px_#000000] flex flex-col">
      <!-- Panel Header -->
      <div class="flex items-center justify-between p-4 border-b-[3px] border-outline"
           :class="executionState === 'running' ? 'bg-[#93c5fd]' : executionState === 'passed' ? 'bg-[#86efac]' : 'bg-[#ef4444] text-white'">
        <div class="flex items-center gap-3">
          <!-- Spinner while running -->
          <span v-if="executionState === 'running'" class="material-symbols-outlined text-[28px] animate-spin">refresh</span>
          <span v-else-if="executionState === 'passed'" class="material-symbols-outlined text-[28px]">check_circle</span>
          <span v-else class="material-symbols-outlined text-[28px]">cancel</span>
          <div>
            <p class="font-label uppercase text-[10px] tracking-widest">Automation Execution</p>
            <h2 class="font-headline text-headline uppercase">{{ executionTcTitle }}</h2>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-label uppercase text-sm px-3 py-1 border-[2px] border-black/30 rounded-sm"
                :class="executionState === 'running' ? 'bg-white/30' : 'bg-black/20'">
            {{ executionState === 'running' ? `Running: ${executionTcTitle}...` : executionState === 'passed' ? 'Passed ✓' : 'Failed ✗' }}
          </span>
          <button @click="closeExecutionPanel" class="p-1 hover:bg-black/10 rounded transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <!-- Progress bar (only while running) -->
      <div v-if="executionState === 'running'" class="h-1.5 bg-surface-dim overflow-hidden">
        <div class="h-full bg-primary animate-pulse" style="width: 60%; animation: progress-bar 2s ease-in-out infinite;"></div>
      </div>

      <!-- Log output -->
      <div class="p-4 flex-1">
        <p class="font-label uppercase text-label mb-2 flex items-center gap-2">
          <span class="material-symbols-outlined text-[14px]">terminal</span> Execution Log
        </p>
        <div class="bg-surface border-[2px] border-outline p-3 font-mono text-[11px] text-on-surface overflow-auto max-h-[300px] whitespace-pre-wrap">
          <span v-if="executionState === 'running' && !executionLog" class="text-on-surface-variant animate-pulse">
            ⏳ Waiting for test runner to start...
          </span>
          <span v-else>{{ executionLog || 'No log output available.' }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 pt-0 flex justify-end gap-3">
        <button v-if="executionState !== 'running'" @click="closeExecutionPanel" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Create Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md max-h-[90vh] overflow-y-auto bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
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
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Project</label>
            <select v-model="newTc.projectId" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option value="">— None —</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Test Type</label>
            <select v-model="newTc.testType" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>Functional</option><option>Smoke Test</option><option>Regression Test</option>
            </select>
          </div>
        </div>

        <!-- Automation Fields Section -->
        <div class="border-t-[2px] border-outline pt-4 mt-4">
          <h3 class="font-label uppercase text-label mb-2">Automation Config</h3>
          <div class="grid grid-cols-2 gap-4 mb-2">
            <div class="flex flex-col gap-1">
              <label class="font-label uppercase text-[10px]">Type</label>
              <select v-model="newTc.automationType" class="w-full px-3 py-1 bg-surface border-[2px] border-outline font-body focus:outline-none text-sm shadow-[2px_2px_0px_#000000]">
                <option value="none">None (Manual)</option>
                <option value="script">Script Mapping</option>
                <option value="data-driven">Data-Driven (API)</option>
                <option value="no-code">Step Builder (No-Code)</option>
              </select>
            </div>
            <div v-if="newTc.automationType !== 'none'" class="flex flex-col gap-1">
              <label class="font-label uppercase text-[10px]">Tool</label>
              <select v-model="newTc.automationTool" class="w-full px-3 py-1 bg-surface border-[2px] border-outline font-body focus:outline-none text-sm shadow-[2px_2px_0px_#000000]">
                <option value="playwright">Playwright</option>
                <option value="cypress" :disabled="newTc.automationType === 'no-code'">Cypress</option>
              </select>
            </div>
          </div>
          
          <!-- Step Builder UI -->
          <div v-if="newTc.automationType === 'no-code'" class="flex flex-col gap-2 mt-4">
            <h4 class="font-label uppercase text-[10px] bg-primary text-on-primary px-2 py-1 w-fit border-[2px] border-outline">Action Steps</h4>
            <div v-for="(step, index) in builderSteps" :key="index" class="bg-surface-dim border-[2px] border-outline p-2 relative flex flex-col gap-2 shadow-[2px_2px_0px_#000000]">
              <button type="button" @click="removeStep(index)" class="absolute top-1 right-1 text-on-surface-variant hover:text-error"><span class="material-symbols-outlined text-[14px]">close</span></button>
              
              <div class="flex items-center gap-2">
                <span class="font-label text-[10px]">{{ index + 1 }}.</span>
                <select v-model="step.action" class="flex-1 px-2 py-1 bg-surface border-[2px] border-outline text-[11px] focus:outline-none">
                  <option value="navigate">Navigate to URL</option>
                  <option value="click">Click Element</option>
                  <option value="fill">Fill Text</option>
                  <option value="check">Check Checkbox</option>
                  <option value="assert_visible">Assert Visible</option>
                  <option value="assert_text">Assert Text Equals</option>
                </select>
              </div>

              <!-- Action specific inputs -->
              <div v-if="step.action === 'navigate'" class="flex flex-col gap-1 pl-4">
                <div class="flex gap-2">
                  <input v-model="step.url" placeholder="https://example.com" class="flex-1 px-2 py-1 bg-surface border-[2px] border-outline text-[11px]" />
                  <button type="button" @click="handleScanUrl(step.url)" :disabled="isScanning" class="px-2 py-1 bg-[#93c5fd] border-[2px] border-outline text-[10px] font-bold uppercase disabled:opacity-50 flex items-center gap-1 hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0px_#000000]">
                    <span v-if="isScanning" class="material-symbols-outlined text-[10px] animate-spin">refresh</span>
                    Scan
                  </button>
                </div>
              </div>
              
              <div v-if="['click', 'fill', 'check', 'assert_visible', 'assert_text'].includes(step.action)" class="flex gap-2 pl-4">
                <select v-model="step.selectorType" class="w-1/3 px-2 py-1 bg-surface border-[2px] border-outline text-[11px]">
                  <option value="locator">CSS / XPath</option>
                  <option value="text">By Text</option>
                  <option value="testid">By Test ID</option>
                </select>
                <input v-model="step.selector" list="scanned-selectors" placeholder="Selector value..." class="flex-1 px-2 py-1 bg-surface border-[2px] border-outline text-[11px]" />
              </div>
              
              <div v-if="['fill', 'assert_text'].includes(step.action)" class="flex flex-col gap-1 pl-4">
                <input v-if="step.action === 'fill'" v-model="step.value" placeholder="Input text value..." class="w-full px-2 py-1 bg-surface border-[2px] border-outline text-[11px]" />
                <input v-if="step.action === 'assert_text'" v-model="step.text" placeholder="Expected text..." class="w-full px-2 py-1 bg-surface border-[2px] border-outline text-[11px]" />
              </div>
            </div>
            
            <div class="flex gap-2 mt-2">
              <button type="button" @click="addStep" class="flex-1 py-1 bg-surface border-[2px] border-outline font-label uppercase text-[10px] hover:bg-surface-dim shadow-[2px_2px_0px_#000000]">
                + Add Step
              </button>
              <button type="button" @click="handleGenerateScript(newTc)" :disabled="isGeneratingScript" class="flex-1 py-1 bg-[#86efac] border-[2px] border-outline font-label uppercase text-[10px] hover:bg-[#4ade80] shadow-[2px_2px_0px_#000000] disabled:opacity-50 flex justify-center items-center gap-1">
                <span v-if="isGeneratingScript" class="material-symbols-outlined text-[12px] animate-spin">refresh</span>
                Generate Script
              </button>
            </div>
          </div>
          
          <div v-if="newTc.automationType === 'script'" class="flex flex-col gap-1 mt-2">
            <label class="font-label uppercase text-[10px]">Script Path (e.g. tests/01-login.spec.ts)</label>
            <input v-model="newTc.automationScript" type="text" class="w-full px-3 py-1 bg-surface border-[2px] border-outline font-body focus:outline-none text-sm shadow-[2px_2px_0px_#000000]" />
          </div>
          
          <div v-if="newTc.automationType === 'data-driven'" class="flex flex-col gap-1 mt-2">
            <label class="font-label uppercase text-[10px]">Configuration (JSON payload)</label>
            <textarea v-model="newTc.automationConfig" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body text-xs font-mono focus:outline-none shadow-[2px_2px_0px_#000000]" rows="4" placeholder='{"method": "GET", "url": "https://api.example.com", "expectedStatus": 200}'></textarea>
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
    <div class="w-full max-w-md max-h-[90vh] overflow-y-auto bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
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
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Project</label>
            <select v-model="editTc.projectId" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option value="">— None —</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label uppercase text-label">Test Type</label>
            <select v-model="editTc.testType" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000]">
              <option>Functional</option><option>Smoke Test</option><option>Regression Test</option>
            </select>
          </div>
        </div>
        <!-- Edit Automation Fields Section -->
        <div class="border-t-[2px] border-outline pt-4 mt-4">
          <h3 class="font-label uppercase text-label mb-2">Automation Config</h3>
          <div class="grid grid-cols-2 gap-4 mb-2">
            <div class="flex flex-col gap-1">
              <label class="font-label uppercase text-[10px]">Type</label>
              <select v-model="editTc.automationType" class="w-full px-3 py-1 bg-surface border-[2px] border-outline font-body focus:outline-none text-sm shadow-[2px_2px_0px_#000000]">
                <option value="none">None (Manual)</option>
                <option value="script">Script Mapping</option>
                <option value="data-driven">Data-Driven (API)</option>
                <option value="no-code">Step Builder (No-Code)</option>
              </select>
            </div>
            <div v-if="editTc.automationType !== 'none'" class="flex flex-col gap-1">
              <label class="font-label uppercase text-[10px]">Tool</label>
              <select v-model="editTc.automationTool" class="w-full px-3 py-1 bg-surface border-[2px] border-outline font-body focus:outline-none text-sm shadow-[2px_2px_0px_#000000]">
                <option value="playwright">Playwright</option>
                <option value="cypress" :disabled="editTc.automationType === 'no-code'">Cypress</option>
              </select>
            </div>
          </div>
          
          <!-- Step Builder UI -->
          <div v-if="editTc.automationType === 'no-code'" class="flex flex-col gap-2 mt-4">
            <h4 class="font-label uppercase text-[10px] bg-primary text-on-primary px-2 py-1 w-fit border-[2px] border-outline">Action Steps</h4>
            <div v-for="(step, index) in builderSteps" :key="index" class="bg-surface-dim border-[2px] border-outline p-2 relative flex flex-col gap-2 shadow-[2px_2px_0px_#000000]">
              <button type="button" @click="removeStep(index)" class="absolute top-1 right-1 text-on-surface-variant hover:text-error"><span class="material-symbols-outlined text-[14px]">close</span></button>
              
              <div class="flex items-center gap-2">
                <span class="font-label text-[10px]">{{ index + 1 }}.</span>
                <select v-model="step.action" class="flex-1 px-2 py-1 bg-surface border-[2px] border-outline text-[11px] focus:outline-none">
                  <option value="navigate">Navigate to URL</option>
                  <option value="click">Click Element</option>
                  <option value="fill">Fill Text</option>
                  <option value="check">Check Checkbox</option>
                  <option value="assert_visible">Assert Visible</option>
                  <option value="assert_text">Assert Text Equals</option>
                </select>
              </div>

              <!-- Action specific inputs -->
              <div v-if="step.action === 'navigate'" class="flex flex-col gap-1 pl-4">
                <div class="flex gap-2">
                  <input v-model="step.url" placeholder="https://example.com" class="flex-1 px-2 py-1 bg-surface border-[2px] border-outline text-[11px]" />
                  <button type="button" @click="handleScanUrl(step.url)" :disabled="isScanning" class="px-2 py-1 bg-[#93c5fd] border-[2px] border-outline text-[10px] font-bold uppercase disabled:opacity-50 flex items-center gap-1 hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0px_#000000]">
                    <span v-if="isScanning" class="material-symbols-outlined text-[10px] animate-spin">refresh</span>
                    Scan
                  </button>
                </div>
              </div>
              
              <div v-if="['click', 'fill', 'check', 'assert_visible', 'assert_text'].includes(step.action)" class="flex gap-2 pl-4">
                <select v-model="step.selectorType" class="w-1/3 px-2 py-1 bg-surface border-[2px] border-outline text-[11px]">
                  <option value="locator">CSS / XPath</option>
                  <option value="text">By Text</option>
                  <option value="testid">By Test ID</option>
                </select>
                <input v-model="step.selector" list="scanned-selectors" placeholder="Selector value..." class="flex-1 px-2 py-1 bg-surface border-[2px] border-outline text-[11px]" />
              </div>
              
              <div v-if="['fill', 'assert_text'].includes(step.action)" class="flex flex-col gap-1 pl-4">
                <input v-if="step.action === 'fill'" v-model="step.value" placeholder="Input text value..." class="w-full px-2 py-1 bg-surface border-[2px] border-outline text-[11px]" />
                <input v-if="step.action === 'assert_text'" v-model="step.text" placeholder="Expected text..." class="w-full px-2 py-1 bg-surface border-[2px] border-outline text-[11px]" />
              </div>
            </div>
            
            <div class="flex gap-2 mt-2">
              <button type="button" @click="addStep" class="flex-1 py-1 bg-surface border-[2px] border-outline font-label uppercase text-[10px] hover:bg-surface-dim shadow-[2px_2px_0px_#000000]">
                + Add Step
              </button>
              <button type="button" @click="handleGenerateScript(editTc)" :disabled="isGeneratingScript" class="flex-1 py-1 bg-[#86efac] border-[2px] border-outline font-label uppercase text-[10px] hover:bg-[#4ade80] shadow-[2px_2px_0px_#000000] disabled:opacity-50 flex justify-center items-center gap-1">
                <span v-if="isGeneratingScript" class="material-symbols-outlined text-[12px] animate-spin">refresh</span>
                Generate Script
              </button>
            </div>
          </div>
          
          <div v-if="editTc.automationType === 'script'" class="flex flex-col gap-1 mt-2">
            <label class="font-label uppercase text-[10px]">Script Path</label>
            <input v-model="editTc.automationScript" type="text" class="w-full px-3 py-1 bg-surface border-[2px] border-outline font-body focus:outline-none text-sm shadow-[2px_2px_0px_#000000]" />
          </div>
          
          <div v-if="editTc.automationType === 'data-driven'" class="flex flex-col gap-1 mt-2">
            <label class="font-label uppercase text-[10px]">Configuration (JSON payload)</label>
            <textarea v-model="editTc.automationConfig" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body text-xs font-mono focus:outline-none shadow-[2px_2px_0px_#000000]" rows="4"></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="isEditOpen = false" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Update</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Manage Scripts Modal -->
  <div v-if="isScriptsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-3xl max-h-[90vh] h-full flex flex-col bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      
      <template v-if="!editingScript">
        <div class="flex items-center justify-between mb-4 border-b-[2px] border-outline pb-2">
          <h2 class="font-headline text-headline uppercase">Manage Scripts</h2>
          <button @click="isScriptsModalOpen = false" class="text-on-surface hover:text-error">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="flex gap-4 mb-4">
          <label class="flex items-center gap-2 font-label uppercase text-sm">
            <input type="radio" value="playwright" v-model="scriptsFramework" @change="fetchScripts"> Playwright
          </label>
          <label class="flex items-center gap-2 font-label uppercase text-sm">
            <input type="radio" value="cypress" v-model="scriptsFramework" @change="fetchScripts"> Cypress
          </label>
        </div>

        <div class="flex-1 overflow-y-auto border-[2px] border-outline bg-surface p-2">
          <div v-if="availableScripts.length === 0" class="p-4 text-center text-on-surface-variant font-body">No scripts found.</div>
          <div v-for="script in availableScripts" :key="script" class="flex items-center justify-between p-2 border-b-[2px] border-outline/50 hover:bg-surface-dim transition-colors">
            <span class="font-mono text-sm">{{ script }}</span>
            <div class="flex gap-2">
              <button @click="editScript(script)" class="px-2 py-1 bg-[#fde047] text-on-surface border-[2px] border-outline font-label uppercase text-[10px] hover:translate-x-[1px] hover:translate-y-[1px] transition-all shadow-[1px_1px_0px_#000000]">Edit</button>
              <button @click="deleteScript(script)" class="px-2 py-1 bg-[#fca5a5] text-on-surface border-[2px] border-outline font-label uppercase text-[10px] hover:bg-error hover:text-white transition-colors shadow-[1px_1px_0px_#000000]">Delete</button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center justify-between mb-4 border-b-[2px] border-outline pb-2">
          <div class="flex flex-col gap-1">
            <h2 class="font-headline text-headline uppercase leading-tight">Edit Script</h2>
            <span class="font-mono text-[10px] text-on-surface-variant bg-surface px-2 py-0.5 border-[2px] border-outline w-fit">{{ editingScript.filename }}</span>
          </div>
          <button @click="cancelEditScript" class="text-on-surface hover:text-error">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <textarea v-model="editingScript.content" class="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[12px] p-4 border-[2px] border-outline outline-none resize-none whitespace-pre" spellcheck="false"></textarea>
        
        <div class="flex justify-end gap-3 pt-4 border-t-[2px] border-outline mt-4">
          <button @click="cancelEditScript" class="px-4 py-2 border-[2px] border-outline font-label uppercase hover:bg-surface-dim transition-colors">Cancel</button>
          <button @click="saveScript" :disabled="isSavingScript" class="px-4 py-2 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50">
            {{ isSavingScript ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </template>
    </div>
  </div>

  <datalist id="scanned-selectors">
    <option v-for="sel in scannedSelectors" :key="sel" :value="sel"></option>
  </datalist>
</template>
