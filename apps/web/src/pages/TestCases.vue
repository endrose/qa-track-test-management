<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const testCases = ref<any[]>([])
const projects = ref<any[]>([])
const filterProjectId = ref(localStorage.getItem('selectedProjectId') || '')
const isModalOpen = ref(false)
const isEditOpen = ref(false)
const editTc = ref<any>(null)
const newTc = ref({ 
  title: '', description: '', priority: 'Medium', status: 'Draft', projectId: '', testType: 'Functional',
  automationType: 'none', automationTool: 'playwright', automationScript: '', automationConfig: ''
})

const parseConfigForBackend = (type: string, config: any) => {
  if (type === 'data-driven' && config) {
    try { return JSON.parse(config) } catch(e) { return null }
  }
  if (type === 'bdd' && config) {
    return { gherkin: config }
  }
  return null
}

const scriptDictionary: Record<string, {label: string, desc: string}[]> = {
  playwright: [
    // Core Actions
    { label: 'await page.goto(\'url\')', desc: 'Navigate to URL' },
    { label: 'await page.getByRole(\'button\', { name: \'Submit\' }).click()', desc: 'Click button by role' },
    { label: 'await page.getByLabel(\'Email\').fill(\'text\')', desc: 'Fill input by label' },
    { label: 'await page.getByPlaceholder(\'Search\').fill(\'text\')', desc: 'Fill input by placeholder' },
    { label: 'await page.getByTestId(\'submit-btn\').click()', desc: 'Click by Test ID' },
    { label: 'await page.locator(\'selector\').check()', desc: 'Check a checkbox or radio' },
    { label: 'await page.locator(\'selector\').selectOption(\'value\')', desc: 'Select dropdown option' },
    // Advanced Actions
    { label: 'await page.locator(\'selector\').hover()', desc: 'Hover over an element' },
    { label: 'await page.locator(\'selector\').dragTo(target)', desc: 'Drag and drop' },
    { label: 'await page.keyboard.press(\'Enter\')', desc: 'Press a keyboard key' },
    // Assertions
    { label: 'await expect(page).toHaveURL(/.*dashboard/)', desc: 'Assert URL matches regex' },
    { label: 'await expect(page).toHaveTitle(\'Title\')', desc: 'Assert page title' },
    { label: 'await expect(page.locator(\'selector\')).toBeVisible()', desc: 'Assert element is visible' },
    { label: 'await expect(page.locator(\'selector\')).toHaveText(\'text\')', desc: 'Assert exact text' },
    { label: 'await expect(page.locator(\'selector\')).toContainText(\'text\')', desc: 'Assert partial text' },
    { label: 'await expect(page.locator(\'selector\')).toBeEnabled()', desc: 'Assert element is enabled' },
    { label: 'await expect(page.locator(\'selector\')).toBeDisabled()', desc: 'Assert element is disabled' },
    // Utilities
    { label: 'await page.waitForTimeout(1000)', desc: 'Wait for 1000ms' },
    { label: 'await page.pause()', desc: 'Pause execution for debugging' },
    { label: 'await page.screenshot({ path: \'shot.png\' })', desc: 'Take a screenshot' },
  ],
  cypress: [
    // Core Actions
    { label: 'cy.visit(\'url\')', desc: 'Visit a URL' },
    { label: 'cy.get(\'selector\').click()', desc: 'Click a DOM element' },
    { label: 'cy.contains(\'text\').click()', desc: 'Click element containing text' },
    { label: 'cy.get(\'selector\').type(\'value\')', desc: 'Type into an input' },
    { label: 'cy.get(\'selector\').clear()', desc: 'Clear an input' },
    { label: 'cy.get(\'selector\').check()', desc: 'Check a checkbox or radio' },
    { label: 'cy.get(\'selector\').select(\'value\')', desc: 'Select dropdown option' },
    // Advanced Actions
    { label: 'cy.get(\'selector\').trigger(\'mouseover\')', desc: 'Hover over an element' },
    { label: 'cy.get(\'selector\').type(\'{enter}\')', desc: 'Press Enter key' },
    { label: 'cy.intercept(\'GET\', \'/api/*\')', desc: 'Intercept network request' },
    // Assertions
    { label: 'cy.url().should(\'include\', \'/dashboard\')', desc: 'Assert URL includes text' },
    { label: 'cy.get(\'selector\').should(\'be.visible\')', desc: 'Assert element is visible' },
    { label: 'cy.get(\'selector\').should(\'not.exist\')', desc: 'Assert element does not exist' },
    { label: 'cy.get(\'selector\').should(\'contain\', \'text\')', desc: 'Assert element contains text' },
    { label: 'cy.get(\'selector\').should(\'have.value\', \'val\')', desc: 'Assert input value' },
    { label: 'cy.get(\'selector\').should(\'be.disabled\')', desc: 'Assert element is disabled' },
    // Utilities
    { label: 'cy.wait(1000)', desc: 'Wait for 1000ms' },
    { label: 'cy.pause()', desc: 'Pause execution for debugging' },
    { label: 'cy.screenshot()', desc: 'Take a screenshot' },
  ],
  jmeter: [
    // Components
    { label: '<TestPlan>', desc: 'Root element of JMeter test' },
    { label: '<ThreadGroup>', desc: 'Simulates concurrent users' },
    { label: '<HTTPSamplerProxy>', desc: 'HTTP Request Sampler' },
    { label: '<HeaderManager>', desc: 'Manage HTTP Headers' },
    { label: '<CookieManager>', desc: 'Manage HTTP Cookies' },
    // Assertions & Listeners
    { label: '<ResponseAssertion>', desc: 'Assert response code/text' },
    { label: '<JSONPathAssertion>', desc: 'Assert JSON response body' },
    { label: '<ResultCollector>', desc: 'Listener for test results' },
    // Variables & Functions
    { label: '${VAR_NAME}', desc: 'Reference a variable' },
    { label: '${__time()}', desc: 'Current time in ms' },
    { label: '${__UUID()}', desc: 'Generate a UUID' },
    { label: '${__Random(1,100)}', desc: 'Generate a random number' },
  ]
}

// Step Builder State
const builderSteps = ref<any[]>([{ action: 'navigate', url: '', selectorType: 'locator', selector: '', value: '' }])
const isGeneratingScript = ref(false)
const scannedSelectors = ref<string[]>([])
const isScanning = ref(false)

const handleScanUrl = async (url: string) => {
  if (!url) return alert('Please enter a valid URL first.')
  isScanning.value = true
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/automation/scan-url?url=${encodeURIComponent(url)}`)
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
    const res = await fetch('http://127.0.0.1:3000/api/automation/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: tcObj.title,
        projectName: project ? project.name : 'Test Suite',
        steps: builderSteps.value,
        gherkin: tcObj.automationType === 'bdd' ? tcObj.automationConfig : undefined,
        framework: tcObj.automationTool || 'playwright'
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
    const res = await fetch(`http://127.0.0.1:3000/api/automation/scripts?framework=${scriptsFramework.value}`)
    if (res.ok) availableScripts.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch scripts', err)
  }
}

const openScriptsModal = () => {
  isScriptsModalOpen.value = true
  fetchScripts()
}

const confirmState = ref({
  show: false,
  title: 'Confirm',
  message: '',
  onConfirm: () => {},
  onCancel: () => {}
})

const requireConfirm = (title: string, message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    confirmState.value = {
      show: true,
      title,
      message,
      onConfirm: () => {
        confirmState.value.show = false
        resolve(true)
      },
      onCancel: () => {
        confirmState.value.show = false
        resolve(false)
      }
    }
  })
}

const deleteScript = async (filename: string) => {
  const confirmed = await requireConfirm('Delete Script', `Delete ${filename}? This action cannot be undone.`)
  if (!confirmed) return
  
  try {
    await fetch(`http://127.0.0.1:3000/api/automation/scripts/${filename}?framework=${scriptsFramework.value}`, { method: 'DELETE' })
    fetchScripts()
  } catch (err) {
    console.error('Failed to delete script', err)
  }
}

const editingScript = ref<{ filename: string; content: string } | null>(null)
const isSavingScript = ref(false)

// Autocomplete State
const scriptTextarea = ref<HTMLTextAreaElement | null>(null)
const autocompleteSuggestions = ref<any[]>([])
const activeSuggestionIndex = ref(0)
const cursorPosition = ref(0)

const handleScriptInput = (e: Event) => {
  const el = e.target as HTMLTextAreaElement
  const val = el.value
  const pos = el.selectionStart
  cursorPosition.value = pos
  
  const beforeCursor = val.slice(0, pos)
  const match = beforeCursor.match(/[\w.]+$/)
  
  if (match && match[0].length >= 2) {
    const query = match[0].toLowerCase()
    const dict = scriptDictionary[scriptsFramework.value] || []
    autocompleteSuggestions.value = dict.filter(d => d.label.toLowerCase().includes(query))
    activeSuggestionIndex.value = 0
  } else {
    autocompleteSuggestions.value = []
  }
}

const handleScriptKeydown = (e: KeyboardEvent) => {
  if (autocompleteSuggestions.value.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeSuggestionIndex.value = (activeSuggestionIndex.value + 1) % autocompleteSuggestions.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      activeSuggestionIndex.value = (activeSuggestionIndex.value - 1 + autocompleteSuggestions.value.length) % autocompleteSuggestions.value.length
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault()
      insertSuggestion(autocompleteSuggestions.value[activeSuggestionIndex.value].label)
    } else if (e.key === 'Escape') {
      autocompleteSuggestions.value = []
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    insertAtCursor('  ')
  }
}

const insertSuggestion = (snippet: string) => {
  if (!editingScript.value) return
  const el = scriptTextarea.value
  if (!el) return
  
  const val = editingScript.value.content
  const pos = cursorPosition.value
  
  const beforeCursor = val.slice(0, pos)
  const afterCursor = val.slice(pos)
  const match = beforeCursor.match(/[\w.]+$/)
  
  if (match) {
    const newBefore = beforeCursor.slice(0, -match[0].length) + snippet
    editingScript.value.content = newBefore + afterCursor
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = newBefore.length
      el.focus()
    }, 0)
  }
  autocompleteSuggestions.value = []
}

const insertAtCursor = (text: string) => {
  if (!editingScript.value || !scriptTextarea.value) return
  const el = scriptTextarea.value
  const pos = el.selectionStart
  const val = editingScript.value.content
  editingScript.value.content = val.slice(0, pos) + text + val.slice(pos)
  setTimeout(() => {
    el.selectionStart = el.selectionEnd = pos + text.length
    el.focus()
  }, 0)
}

const editScript = async (filename: string) => {
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/automation/scripts/${filename}?framework=${scriptsFramework.value}`)
    if (res.ok) {
      const data = await res.json()
      editingScript.value = { filename, content: data.content }
      autocompleteSuggestions.value = []
    }
  } catch (err) {
    console.error('Failed to load script', err)
  }
}

const saveScript = async () => {
  if (!editingScript.value) return
  isSavingScript.value = true
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/automation/scripts/${editingScript.value.filename}?framework=${scriptsFramework.value}`, {
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
  autocompleteSuggestions.value = []
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
    const res = await fetch('http://127.0.0.1:3000/api/test-cases')
    if (res.ok) testCases.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch test cases', err)
  }
}

const fetchProjects = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/projects')
    if (res.ok) projects.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch projects', err)
  }
}

const createTestCase = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/test-cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newTc.value,
        project: newTc.value.projectId ? { id: newTc.value.projectId } : null,
        automationConfig: parseConfigForBackend(newTc.value.automationType, newTc.value.automationConfig)
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
  let configStr = ''
  if (tc.automationType === 'data-driven') configStr = tc.automationConfig ? JSON.stringify(tc.automationConfig, null, 2) : ''
  if (tc.automationType === 'bdd') configStr = tc.automationConfig?.gherkin || ''
  
  editTc.value = { 
    ...tc, 
    projectId: tc.project?.id || '',
    automationConfig: configStr
  }
  isEditOpen.value = true
}

const updateTestCase = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/test-cases/${editTc.value.id}`, {
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
        automationConfig: parseConfigForBackend(editTc.value.automationType, editTc.value.automationConfig)
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
  const confirmed = await requireConfirm('Delete Test Case', 'Are you sure you want to delete this test case?')
  if (!confirmed) return
  
  await fetch(`http://127.0.0.1:3000/api/test-cases/${id}`, { method: 'DELETE' })
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
      const res = await fetch('http://127.0.0.1:3000/api/automation')
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
    const res = await fetch(`http://127.0.0.1:3000/api/automation/test-cases/${tc.id}/execute`, { method: 'POST' })
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

const closeExecutionPanel = async () => {
  if (executionState.value === 'running') {
    const confirmed = await requireConfirm('Close Panel', 'Test is still running. Close panel anyway?')
    if (!confirmed) return
    clearInterval(pollInterval)
  }
  showExecutionPanel.value = false
  executionState.value = 'idle'
  executionLog.value = ''
}

onMounted(() => {
  fetchTestCases()
  fetchProjects()
  // Dengarkan event switch project dari TopBar
  window.addEventListener('project-switched', handleProjectSwitched)
})

onUnmounted(() => {
  clearInterval(pollInterval)
  window.removeEventListener('project-switched', handleProjectSwitched)
})

const handleProjectSwitched = (e: Event) => {
  const detail = (e as CustomEvent).detail
  if (detail?.id) {
    filterProjectId.value = detail.id
  }
}
</script>

<template>
  <ConfirmModal 
    :show="confirmState.show"
    :title="confirmState.title"
    :message="confirmState.message"
    @confirm="confirmState.onConfirm"
    @cancel="confirmState.onCancel"
  />

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
            <div v-if="newTc.testType === 'Smoke Test'" class="mt-1 text-[10px] text-on-surface-variant font-label uppercase bg-[#93c5fd]/20 p-2 border-[1px] border-[#93c5fd] rounded-sm">
              💡 Example: Verify critical paths like user login, API health, or checkout button.
            </div>
            <div v-if="newTc.testType === 'Regression Test'" class="mt-1 text-[10px] text-on-surface-variant font-label uppercase bg-[#fca5a5]/20 p-2 border-[1px] border-[#fca5a5] rounded-sm">
              💡 Example: End-to-end verification of an entire module, ensuring previous bugs stay fixed.
            </div>
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
                <option value="bdd">BDD (Gherkin)</option>
              </select>
            </div>
            <div v-if="newTc.automationType !== 'none'" class="flex flex-col gap-1">
              <label class="font-label uppercase text-[10px]">Tool</label>
              <select v-model="newTc.automationTool" class="w-full px-3 py-1 bg-surface border-[2px] border-outline font-body focus:outline-none text-sm shadow-[2px_2px_0px_#000000]">
                <option value="playwright">Playwright</option>
                <option value="cypress">Cypress</option>
                <option value="jmeter">JMeter (Performance)</option>
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
          
          <div v-if="newTc.automationType === 'bdd'" class="flex flex-col gap-1 mt-2">
            <label class="font-label uppercase text-[10px]">Gherkin Script (Feature / Scenario)</label>
            <textarea v-model="newTc.automationConfig" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body text-xs font-mono focus:outline-none shadow-[2px_2px_0px_#000000]" rows="6" placeholder="Feature: Login&#10;  Scenario: Successful Login&#10;    Given I navigate to the login page&#10;    When I enter valid credentials&#10;    Then I should see the dashboard"></textarea>
            <button type="button" @click="handleGenerateScript(newTc)" :disabled="isGeneratingScript || !newTc.automationConfig" class="mt-2 py-1 bg-[#86efac] border-[2px] border-outline font-label uppercase text-[10px] hover:bg-[#4ade80] shadow-[2px_2px_0px_#000000] disabled:opacity-50 flex justify-center items-center gap-1 w-fit px-4">
              <span v-if="isGeneratingScript" class="material-symbols-outlined text-[12px] animate-spin">refresh</span>
              Generate Script Skeleton
            </button>
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
            <div v-if="editTc.testType === 'Smoke Test'" class="mt-1 text-[10px] text-on-surface-variant font-label uppercase bg-[#93c5fd]/20 p-2 border-[1px] border-[#93c5fd] rounded-sm">
              💡 Example: Verify critical paths like user login, API health, or checkout button.
            </div>
            <div v-if="editTc.testType === 'Regression Test'" class="mt-1 text-[10px] text-on-surface-variant font-label uppercase bg-[#fca5a5]/20 p-2 border-[1px] border-[#fca5a5] rounded-sm">
              💡 Example: End-to-end verification of an entire module, ensuring previous bugs stay fixed.
            </div>
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
                <option value="bdd">BDD (Gherkin)</option>
              </select>
            </div>
            <div v-if="editTc.automationType !== 'none'" class="flex flex-col gap-1">
              <label class="font-label uppercase text-[10px]">Tool</label>
              <select v-model="editTc.automationTool" class="w-full px-3 py-1 bg-surface border-[2px] border-outline font-body focus:outline-none text-sm shadow-[2px_2px_0px_#000000]">
                <option value="playwright">Playwright</option>
                <option value="cypress">Cypress</option>
                <option value="jmeter">JMeter (Performance)</option>
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
          
          <div v-if="editTc.automationType === 'bdd'" class="flex flex-col gap-1 mt-2">
            <label class="font-label uppercase text-[10px]">Gherkin Script (Feature / Scenario)</label>
            <textarea v-model="editTc.automationConfig" class="w-full px-3 py-2 bg-surface border-[2px] border-outline font-body text-xs font-mono focus:outline-none shadow-[2px_2px_0px_#000000]" rows="6" placeholder="Feature: Login&#10;  Scenario: Successful Login&#10;    Given I navigate to the login page&#10;    When I enter valid credentials&#10;    Then I should see the dashboard"></textarea>
            <button type="button" @click="handleGenerateScript(editTc)" :disabled="isGeneratingScript || !editTc.automationConfig" class="mt-2 py-1 bg-[#86efac] border-[2px] border-outline font-label uppercase text-[10px] hover:bg-[#4ade80] shadow-[2px_2px_0px_#000000] disabled:opacity-50 flex justify-center items-center gap-1 w-fit px-4">
              <span v-if="isGeneratingScript" class="material-symbols-outlined text-[12px] animate-spin">refresh</span>
              Generate Script Skeleton
            </button>
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
    <div class="w-full h-full flex flex-col bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]" :class="editingScript ? 'max-w-5xl max-h-[90vh]' : 'max-w-3xl max-h-[90vh]'">
      
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
          <label class="flex items-center gap-2 font-label uppercase text-sm">
            <input type="radio" value="jmeter" v-model="scriptsFramework" @change="fetchScripts"> JMeter
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
        
        <div class="flex flex-1 gap-4 overflow-hidden min-h-[400px]">
          <!-- Left: Editor & Autocomplete -->
          <div class="flex-1 flex flex-col relative border-[2px] border-outline">
            <textarea 
              ref="scriptTextarea"
              v-model="editingScript.content" 
              @input="handleScriptInput"
              @keydown="handleScriptKeydown"
              @click="handleScriptInput"
              class="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] p-4 outline-none resize-none whitespace-pre" 
              spellcheck="false"></textarea>
              
            <!-- Autocomplete Floating Menu -->
            <div v-if="autocompleteSuggestions.length > 0" class="absolute bottom-2 left-2 right-2 bg-surface border-[2px] border-primary shadow-[4px_4px_0px_#000000] z-10 max-h-[150px] overflow-y-auto">
              <div class="bg-primary text-on-primary px-2 py-1 font-label uppercase text-[9px] sticky top-0">Suggestions (Tab/Enter to insert)</div>
              <div v-for="(sugg, i) in autocompleteSuggestions" :key="i" 
                   @click="insertSuggestion(sugg.label)"
                   class="px-3 py-2 border-b-[1px] border-outline flex justify-between items-center cursor-pointer font-mono text-[11px]"
                   :class="activeSuggestionIndex === i ? 'bg-[#93c5fd] font-bold text-on-surface' : 'hover:bg-surface-dim text-on-surface'">
                <span>{{ sugg.label }}</span>
                <span class="font-label uppercase text-[9px] text-on-surface-variant ml-4 text-right">{{ sugg.desc }}</span>
              </div>
            </div>
          </div>
          
          <!-- Right: Dictionary Sidebar -->
          <div class="w-[300px] border-[2px] border-outline flex flex-col bg-surface overflow-hidden shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]">
            <div class="bg-primary text-on-primary p-2 font-label uppercase text-[10px] tracking-widest border-b-[2px] border-outline">
              {{ scriptsFramework }} Dictionary
            </div>
            <div class="overflow-y-auto p-2 flex flex-col gap-2">
              <div v-for="(item, idx) in scriptDictionary[scriptsFramework]" :key="idx" class="border-[2px] border-outline p-2 bg-surface-container-lowest flex flex-col gap-1 hover:bg-surface-dim transition-colors group">
                <span class="font-label uppercase text-[9px] text-on-surface-variant">{{ item.desc }}</span>
                <code class="font-mono text-[10px] font-bold text-primary break-all">{{ item.label }}</code>
                <button type="button" @click="insertAtCursor(item.label)" class="self-end mt-1 px-2 py-1 bg-[#86efac] border-[2px] border-outline font-label uppercase text-[9px] opacity-0 group-hover:opacity-100 transition-opacity hover:translate-x-[1px] hover:translate-y-[1px] shadow-[1px_1px_0px_#000000]">
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
        
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
