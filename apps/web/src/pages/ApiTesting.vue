<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// ---- State ----
const activeTab = ref<'runner' | 'import' | 'history'>('runner')
const projects = ref<any[]>([])
const selectedProject = ref('')

// Runner state
const request = ref({
  method: 'GET',
  url: '',
  headers: [{ key: 'Content-Type', value: 'application/json' }] as { key: string; value: string }[],
  body: '',
  expectedStatus: 200,
  validateSchema: false,
  schema: '',
  name: '',
  description: '',
})
const response = ref<any>(null)
const isRunning = ref(false)
const requestHistory = ref<any[]>([])

// Import state
const importJson = ref('')
const importType = ref<'postman' | 'openapi'>('postman')
const importedCases = ref<any[]>([])
const isImporting = ref(false)
const importError = ref('')

// Test Cases list  
const testCases = ref<any[]>([])

const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

const methodColors: Record<string, string> = {
  GET: 'bg-[#86efac]', POST: 'bg-[#93c5fd]', PUT: 'bg-[#fde047]',
  PATCH: 'bg-[#fdba74]', DELETE: 'bg-[#fca5a5] text-white', HEAD: 'bg-[#c4b5fd]', OPTIONS: 'bg-surface-container'
}

const statusColor = computed(() => {
  if (!response.value) return ''
  const s = response.value.status
  if (s >= 200 && s < 300) return 'text-green-600'
  if (s >= 400) return 'text-red-500'
  return 'text-yellow-600'
})

// ---- API Helpers ----
const fetchProjects = async () => {
  const r = await fetch('http://127.0.0.1:3000/api/projects')
  if (r.ok) projects.value = await r.json()
}

const fetchApiTestCases = async () => {
  const r = await fetch('http://127.0.0.1:3000/api/test-cases')
  if (r.ok) {
    const all = await r.json()
    testCases.value = all.filter((tc: any) => tc.automationType === 'api' || tc.endpointUrl)
  }
}

// ---- Request Runner ----
const addHeader = () => request.value.headers.push({ key: '', value: '' })
const removeHeader = (idx: number) => request.value.headers.splice(idx, 1)

const sendRequest = async () => {
  if (!request.value.url) return
  isRunning.value = true
  response.value = null
  const startTime = Date.now()
  try {
    const headers: Record<string, string> = {}
    request.value.headers.filter(h => h.key).forEach(h => { headers[h.key] = h.value })

    const options: RequestInit = { method: request.value.method, headers }
    if (['POST', 'PUT', 'PATCH'].includes(request.value.method) && request.value.body) {
      options.body = request.value.body
    }

    // Proxy via backend to bypass CORS
    const proxyRes = await fetch('http://127.0.0.1:3000/api/test-cases/api-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: request.value.method,
        url: request.value.url,
        headers,
        body: ['POST', 'PUT', 'PATCH'].includes(request.value.method) ? request.value.body : undefined,
      })
    })

    const duration = Date.now() - startTime
    if (proxyRes.ok) {
      const data = await proxyRes.json()
      // Validate schema if enabled
      let schemaResult = null
      if (request.value.validateSchema && request.value.schema) {
        try {
          const schema = JSON.parse(request.value.schema)
          schemaResult = validateSchema(data.body, schema)
        } catch { schemaResult = { valid: false, error: 'Invalid schema JSON' } }
      }

      response.value = {
        status: data.status,
        statusText: data.statusText,
        headers: data.headers,
        body: data.body,
        duration,
        passed: data.status === request.value.expectedStatus,
        schemaResult,
      }

      // Add to history
      requestHistory.value.unshift({
        id: Date.now(),
        name: request.value.name || request.value.url,
        method: request.value.method,
        url: request.value.url,
        status: data.status,
        passed: data.status === request.value.expectedStatus,
        duration,
        timestamp: new Date().toISOString(),
      })
    } else {
      const errData = await proxyRes.json()
      response.value = { error: errData.error || 'Request failed', duration }
    }
  } catch (err: any) {
    response.value = { error: err.message || 'Network error', duration: Date.now() - startTime }
  }
  isRunning.value = false
}

// Simple JSON schema validator
const validateSchema = (data: any, schema: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  if (schema.required && Array.isArray(schema.required)) {
    for (const key of schema.required) {
      if (data === null || data === undefined || !(key in data)) {
        errors.push(`Missing required field: "${key}"`)
      }
    }
  }
  if (schema.properties && data && typeof data === 'object') {
    for (const [key, propSchema] of Object.entries(schema.properties as Record<string, any>)) {
      if (key in data) {
        const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key]
        if (propSchema.type && propSchema.type !== actualType) {
          errors.push(`Field "${key}": expected ${propSchema.type}, got ${actualType}`)
        }
      }
    }
  }
  return { valid: errors.length === 0, errors }
}

// Save test case from current request
const saveAsTestCase = async () => {
  if (!request.value.name || !request.value.url) {
    alert('Please fill Name and URL before saving.')
    return
  }
  try {
    const res = await fetch('http://127.0.0.1:3000/api/test-cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: request.value.name,
        description: request.value.description || `API Test: ${request.value.method} ${request.value.url}`,
        automationType: 'api',
        automationTool: 'api',
        testType: 'API Testing',
        endpointUrl: request.value.url,
        httpMethod: request.value.method,
        headers: Object.fromEntries(request.value.headers.filter(h => h.key).map(h => [h.key, h.value])),
        requestBody: request.value.body,
        expectedStatus: request.value.expectedStatus,
        expectedSchema: request.value.validateSchema && request.value.schema ? JSON.parse(request.value.schema) : null,
        status: 'Draft',
        project: selectedProject.value ? { id: selectedProject.value } : null,
      }),
    })
    if (res.ok) {
      alert('Test case saved successfully!')
      fetchApiTestCases()
    } else {
      const errData = await res.json()
      alert(`Failed to save: ${errData.message || 'Unknown error'}`)
    }
  } catch (err) { 
    console.error('Save failed', err)
    alert('An error occurred while saving.')
  }
}

// ---- Importer ----
const parsePostman = (json: any): any[] => {
  const cases: any[] = []
  const processItems = (items: any[], folder = '') => {
    for (const item of items) {
      if (item.item) { processItems(item.item, item.name); continue }
      if (!item.request) continue
      const req = item.request
      const url = typeof req.url === 'string' ? req.url : req.url?.raw || ''
      const headers: Record<string, string> = {}
      if (req.header) req.header.forEach((h: any) => { headers[h.key] = h.value })
      const body = req.body?.raw || ''
      cases.push({
        title: folder ? `${folder} / ${item.name}` : item.name,
        description: `Imported from Postman collection`,
        automationType: 'api',
        automationTool: 'api',
        testType: 'API Testing',
        endpointUrl: url,
        httpMethod: (req.method || 'GET').toUpperCase(),
        headers,
        requestBody: body,
        expectedStatus: 200,
        status: 'Draft',
      })
    }
  }
  if (json.item) processItems(json.item)
  return cases
}

const parseOpenAPI = (json: any): any[] => {
  const cases: any[] = []
  const baseUrl = json.servers?.[0]?.url || ''
  const paths = json.paths || {}
  for (const [path, methods] of Object.entries(paths as Record<string, any>)) {
    for (const [method, op] of Object.entries(methods as Record<string, any>)) {
      if (['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(method.toLowerCase())) {
        const tag = op.tags?.[0] || ''
        cases.push({
          title: op.summary || `${method.toUpperCase()} ${path}`,
          description: op.description || `OpenAPI: ${method.toUpperCase()} ${path}${tag ? ` (${tag})` : ''}`,
          automationType: 'api',
          automationTool: 'api',
          testType: 'API Testing',
          endpointUrl: baseUrl + path,
          httpMethod: method.toUpperCase(),
          headers: { 'Content-Type': 'application/json' },
          requestBody: '',
          expectedStatus: parseInt(Object.keys(op.responses || { '200': '' })[0]) || 200,
          status: 'Draft',
        })
      }
    }
  }
  return cases
}

const runImport = () => {
  importError.value = ''
  importedCases.value = []
  if (!importJson.value.trim()) { importError.value = 'Paste your JSON content first.'; return }

  let json: any
  try {
    json = JSON.parse(importJson.value)
  } catch (e: any) {
    importError.value = `Invalid JSON: ${e.message}`
    return
  }

  // --- Auto-detect format from JSON structure, ignore the toggle button ---
  const isPostman = !!(json.item || json.info?._postman_id || json.info?.schema?.includes('postman'))
  const isOpenAPI = !!(json.openapi || json.swagger || json.paths)

  let parsed: any[] = []
  let detectedAs = ''

  if (isPostman) {
    detectedAs = 'Postman Collection'
    parsed = parsePostman(json)
  } else if (isOpenAPI) {
    detectedAs = `OpenAPI ${json.openapi || json.swagger || ''}`.trim()
    parsed = parseOpenAPI(json)
  } else if (importType.value === 'postman') {
    detectedAs = 'Postman (manual)'
    parsed = parsePostman(json)
  } else if (importType.value === 'openapi') {
    detectedAs = 'OpenAPI (manual)'
    parsed = parseOpenAPI(json)
  }

  if (parsed.length === 0) {
    // Build a helpful diagnostic message
    const keys = Object.keys(json).slice(0, 10).join(', ')
    importError.value = `No endpoints found (detected as: ${detectedAs || 'unknown format'}).`
      + `\n\nTop-level keys found in your JSON: [${keys}]`
      + `\n\nFor Postman: make sure the JSON has an "item" array at the top level.`
      + `\nFor OpenAPI: make sure the JSON has a "paths" object.`
    return
  }

  detectedFormatInfo.value = `Detected: ${detectedAs} — ${parsed.length} endpoint(s) found`
  importedCases.value = parsed
}

const detectedFormatInfo = ref('')


const saveImported = async () => {
  if (!importedCases.value.length) return
  isImporting.value = true
  let saved = 0
  let failed = 0
  for (const tc of importedCases.value) {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/test-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tc, project: selectedProject.value ? { id: selectedProject.value } : null }),
      })
      if (res.ok) saved++
      else failed++
    } catch { failed++ }
  }
  isImporting.value = false
  
  if (failed > 0) {
    alert(`Saved ${saved} API test cases. ${failed} failed (possibly due to duplicate titles).`)
  } else {
    alert(`Saved all ${saved} API test cases successfully!`)
  }
  
  importedCases.value = []
  importJson.value = ''
  fetchApiTestCases()
  activeTab.value = 'runner'
}

// Load a saved test case into runner
const loadTestCase = (tc: any) => {
  request.value = {
    name: tc.title,
    description: tc.description || '',
    method: tc.httpMethod || 'GET',
    url: tc.endpointUrl || '',
    headers: Object.entries(tc.headers || { 'Content-Type': 'application/json' }).map(([key, value]) => ({ key, value: value as string })),
    body: tc.requestBody || '',
    expectedStatus: tc.expectedStatus || 200,
    validateSchema: !!tc.expectedSchema,
    schema: tc.expectedSchema ? JSON.stringify(tc.expectedSchema, null, 2) : '',
  }
  activeTab.value = 'runner'
}

onMounted(() => { fetchProjects(); fetchApiTestCases() })
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-[#93c5fd] text-on-surface font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Testing</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">API Testing</h1>
    </div>
    <div class="flex items-center gap-3">
      <select v-model="selectedProject" class="px-3 py-2 bg-surface border-[2px] border-outline text-sm font-label shadow-[2px_2px_0px_#000000]">
        <option value="">— No Project —</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
    </div>
  </div>

  <!-- Tabs -->
  <div class="flex border-b-[3px] border-outline bg-surface-container-lowest">
    <button v-for="tab in ([{key:'runner',label:'Request Runner',icon:'send'},{key:'import',label:'Import Spec',icon:'upload'},{key:'history',label:'Saved Tests',icon:'history'}])" :key="tab.key"
      @click="activeTab = tab.key as any"
      :class="activeTab === tab.key ? 'bg-primary text-on-primary border-b-[3px] border-primary' : 'hover:bg-surface-dim'"
      class="px-5 py-3 font-label uppercase text-sm flex items-center gap-2 border-r-[2px] border-outline transition-colors">
      <span class="material-symbols-outlined text-[18px]">{{ tab.icon }}</span>
      <span class="hidden md:inline">{{ tab.label }}</span>
    </button>
  </div>

  <!-- ======================== REQUEST RUNNER ======================== -->
  <div v-if="activeTab === 'runner'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Left: Request Builder -->
    <div class="flex flex-col gap-4">
      <!-- URL Bar -->
      <div class="bg-surface-container-lowest border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000]">
        <h2 class="font-headline text-sm uppercase flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-[18px]">api</span> Request Configuration
        </h2>
        <div class="flex flex-col gap-1 mb-3">
          <label class="font-label uppercase text-[11px]">Test Case Name</label>
          <input v-model="request.name" placeholder="e.g. Login API - Success" class="w-full px-3 py-2 bg-surface border-[2px] border-outline text-sm font-body focus:outline-none shadow-[2px_2px_0px_#000000]" />
        </div>
        <div class="flex gap-2 mb-3">
          <select v-model="request.method" class="px-3 py-2 bg-surface border-[2px] border-outline font-label text-sm shadow-[2px_2px_0px_#000000]">
            <option v-for="m in httpMethods" :key="m">{{ m }}</option>
          </select>
          <input v-model="request.url" placeholder="https://api.example.com/endpoint" class="flex-1 px-3 py-2 bg-surface border-[2px] border-outline text-sm font-body focus:outline-none shadow-[2px_2px_0px_#000000]" />
        </div>
        <div class="flex items-center gap-3 mb-3">
          <label class="font-label uppercase text-[11px]">Expected Status:</label>
          <input v-model.number="request.expectedStatus" type="number" class="w-20 px-2 py-1 bg-surface border-[2px] border-outline text-sm font-label text-center shadow-[2px_2px_0px_#000000]" />
        </div>

        <!-- Headers -->
        <div class="border-t-[2px] border-outline pt-3">
          <div class="flex items-center justify-between mb-2">
            <label class="font-label uppercase text-[11px]">Headers</label>
            <button @click="addHeader" type="button" class="px-2 py-1 bg-surface border-[2px] border-outline text-[10px] font-label uppercase hover:bg-surface-dim">+ Add</button>
          </div>
          <div v-for="(h, idx) in request.headers" :key="idx" class="flex gap-2 mb-1">
            <input v-model="h.key" placeholder="Key" class="flex-1 px-2 py-1 bg-surface border-[2px] border-outline text-sm font-body focus:outline-none" />
            <input v-model="h.value" placeholder="Value" class="flex-1 px-2 py-1 bg-surface border-[2px] border-outline text-sm font-body focus:outline-none" />
            <button @click="removeHeader(idx)" type="button" class="px-2 py-1 bg-[#fca5a5] border-[2px] border-outline text-[10px]">✕</button>
          </div>
        </div>

        <!-- Body -->
        <div v-if="['POST','PUT','PATCH'].includes(request.method)" class="border-t-[2px] border-outline pt-3 mt-3">
          <label class="font-label uppercase text-[11px] mb-2 block">Request Body (JSON)</label>
          <textarea v-model="request.body" rows="5" placeholder='{"key": "value"}' class="w-full px-3 py-2 bg-surface border-[2px] border-outline text-sm font-mono focus:outline-none shadow-[2px_2px_0px_#000000]"></textarea>
        </div>

        <!-- Schema Validation -->
        <div class="border-t-[2px] border-outline pt-3 mt-3">
          <label class="flex items-center gap-2 cursor-pointer mb-2">
            <input type="checkbox" v-model="request.validateSchema" class="w-4 h-4 border-[2px] border-outline" />
            <span class="font-label uppercase text-[11px]">Validate Response Schema (JSON Schema)</span>
          </label>
          <textarea v-if="request.validateSchema" v-model="request.schema" rows="5" placeholder='{"type":"object","required":["id","name"],"properties":{"id":{"type":"number"},"name":{"type":"string"}}}' class="w-full px-3 py-2 bg-surface border-[2px] border-outline text-sm font-mono focus:outline-none shadow-[2px_2px_0px_#000000]"></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mt-4">
          <button @click="sendRequest" :disabled="isRunning || !request.url"
            :class="isRunning ? 'bg-gray-300 cursor-wait' : 'bg-primary text-on-primary shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'"
            class="flex-1 px-4 py-3 font-label uppercase border-[2px] border-outline transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[18px]">{{ isRunning ? 'hourglass_empty' : 'play_arrow' }}</span>
            {{ isRunning ? 'Running...' : 'Send Request' }}
          </button>
          <button @click="saveAsTestCase" class="px-4 py-3 bg-[#86efac] border-[2px] border-outline font-label uppercase text-sm shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-1">
            <span class="material-symbols-outlined text-[18px]">save</span> Save
          </button>
        </div>
      </div>
    </div>

    <!-- Right: Response -->
    <div class="flex flex-col gap-4">
      <div class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000]">
        <div class="flex items-center justify-between p-4 border-b-[2px] border-outline">
          <h2 class="font-headline text-sm uppercase flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">receipt_long</span> Response
          </h2>
          <div v-if="response && !response.error" class="flex items-center gap-3">
            <span :class="statusColor" class="font-black text-xl">{{ response.status }}</span>
            <span class="text-sm text-on-surface-variant">{{ response.statusText }}</span>
            <span class="px-2 py-0.5 bg-surface-container border-[2px] border-outline font-label text-[10px] uppercase">{{ response.duration }}ms</span>
            <span :class="response.passed ? 'bg-[#86efac]' : 'bg-[#fca5a5]'" class="px-2 py-0.5 border-[2px] border-outline font-label text-[10px] uppercase">{{ response.passed ? '✓ PASSED' : '✗ FAILED' }}</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!response" class="p-12 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-5xl block mb-3 opacity-30">api</span>
          <p class="font-label uppercase text-sm">Configure and send a request to see the response</p>
        </div>

        <!-- Error -->
        <div v-else-if="response.error" class="p-4">
          <div class="bg-[#fca5a5] border-[2px] border-outline p-4">
            <p class="font-label uppercase text-sm mb-1">Request Error</p>
            <p class="font-body text-sm">{{ response.error }}</p>
            <p class="text-[10px] text-on-surface-variant mt-2">Duration: {{ response.duration }}ms</p>
          </div>
        </div>

        <!-- Response Content -->
        <div v-else class="p-4 space-y-4">
          <!-- Schema Validation Result -->
          <div v-if="response.schemaResult" :class="response.schemaResult.valid ? 'bg-[#86efac]' : 'bg-[#fca5a5]'" class="border-[2px] border-outline p-3">
            <p class="font-label uppercase text-[11px] mb-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">{{ response.schemaResult.valid ? 'check_circle' : 'error' }}</span>
              Schema Validation: {{ response.schemaResult.valid ? 'PASSED' : 'FAILED' }}
            </p>
            <ul v-if="response.schemaResult.errors?.length" class="text-sm list-disc pl-4">
              <li v-for="e in response.schemaResult.errors" :key="e">{{ e }}</li>
            </ul>
          </div>

          <!-- Response Body -->
          <div>
            <p class="font-label uppercase text-[11px] mb-2">Response Body</p>
            <pre class="bg-surface border-[2px] border-outline p-3 text-xs font-mono overflow-auto max-h-80 whitespace-pre-wrap">{{ typeof response.body === 'object' ? JSON.stringify(response.body, null, 2) : response.body }}</pre>
          </div>

          <!-- Response Headers -->
          <div>
            <p class="font-label uppercase text-[11px] mb-2">Response Headers</p>
            <div class="bg-surface border-[2px] border-outline divide-y-[2px] divide-outline max-h-48 overflow-auto">
              <div v-for="(v, k) in response.headers" :key="k" class="flex p-2 text-xs font-mono">
                <span class="font-bold w-48 shrink-0 text-primary">{{ k }}</span>
                <span>{{ v }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Run History -->
      <div v-if="requestHistory.length" class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000]">
        <div class="p-3 border-b-[2px] border-outline">
          <h3 class="font-headline uppercase text-sm flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">history</span> Session History
          </h3>
        </div>
        <div class="divide-y-[2px] divide-outline max-h-52 overflow-auto">
          <div v-for="h in requestHistory" :key="h.id" class="flex items-center gap-2 p-2 hover:bg-surface-dim text-sm">
            <span :class="methodColors[h.method]" class="px-1.5 py-0.5 border-[2px] border-outline font-label text-[9px] uppercase shrink-0">{{ h.method }}</span>
            <span class="flex-1 truncate font-mono text-xs">{{ h.url }}</span>
            <span :class="h.status >= 200 && h.status < 300 ? 'text-green-600' : 'text-red-500'" class="font-black shrink-0">{{ h.status }}</span>
            <span class="text-on-surface-variant text-[10px] shrink-0">{{ h.duration }}ms</span>
            <span :class="h.passed ? 'bg-[#86efac]' : 'bg-[#fca5a5]'" class="px-1.5 py-0.5 border-[2px] border-outline text-[9px] font-label uppercase shrink-0">{{ h.passed ? 'PASS' : 'FAIL' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ======================== IMPORT ======================== -->
  <div v-if="activeTab === 'import'" class="flex flex-col gap-6">
    <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
      <h2 class="font-headline uppercase text-sm flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
        <span class="material-symbols-outlined text-[18px]">upload</span> Import API Specification
      </h2>

      <!-- Format Hint -->
      <div class="flex flex-wrap gap-3 mb-2 items-center">
        <span class="font-label uppercase text-[11px] text-on-surface-variant">Fallback hint:</span>
        <button v-for="t in [{key:'postman',label:'Postman Collection v2.x'},{key:'openapi',label:'OpenAPI / Swagger 3.x'}]" :key="t.key"
          @click="importType = t.key as any"
          :class="importType === t.key ? 'bg-primary text-on-primary shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-surface shadow-[2px_2px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px]'"
          class="px-4 py-2 border-[2px] border-outline font-label uppercase text-sm transition-all">
          {{ t.label }}
        </button>
      </div>
      <p class="text-[11px] text-on-surface-variant italic mb-4">⚡ Format auto-detected from JSON content — tombol di atas hanya sebagai fallback.</p>

      <!-- Paste Area -->
      <div class="flex flex-col gap-1 mb-4">
        <label class="font-label uppercase text-[11px]">Paste JSON Content (Postman Collection atau OpenAPI spec)</label>
        <textarea v-model="importJson" rows="12" placeholder="Paste Postman Collection v2.x atau OpenAPI 3.x JSON di sini...&#10;&#10;Postman: Postman App → Export Collection → Collection v2.1&#10;OpenAPI: paste isi swagger.json atau openapi.json" class="w-full px-3 py-2 bg-surface border-[2px] border-outline text-sm font-mono focus:outline-none shadow-[2px_2px_0px_#000000]"></textarea>
      </div>

      <div v-if="importError" class="bg-[#fca5a5] border-[2px] border-outline p-3 mb-4">
        <p class="font-label uppercase text-[11px] mb-2 flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">error</span> Import Error
        </p>
        <pre class="text-sm font-body whitespace-pre-wrap leading-relaxed">{{ importError }}</pre>
      </div>

      <div v-if="detectedFormatInfo && !importError" class="bg-[#86efac] border-[2px] border-outline p-3 mb-4 font-label uppercase text-[11px] flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px]">check_circle</span>
        {{ detectedFormatInfo }}
      </div>

      <button @click="runImport" class="px-6 py-3 bg-primary text-on-primary font-label uppercase border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">analytics</span> Parse & Preview
      </button>
    </div>

    <!-- Preview Table -->
    <div v-if="importedCases.length" class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000]">
      <div class="p-4 border-b-[2px] border-outline flex items-center justify-between flex-wrap gap-3">
        <h3 class="font-headline uppercase text-sm flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">list_alt</span>
          Found {{ importedCases.length }} Endpoint(s) — Review before saving
        </h3>
        <button @click="saveImported" :disabled="isImporting"
          :class="isImporting ? 'bg-gray-300 cursor-wait' : 'bg-[#86efac] shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'"
          class="px-4 py-2 border-[2px] border-outline font-label uppercase text-sm transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">save</span>
          {{ isImporting ? 'Saving...' : `Save All as Test Cases` }}
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-primary text-on-primary font-label uppercase text-[11px]">
              <th class="p-3 border-r-[2px] border-outline">Method</th>
              <th class="p-3 border-r-[2px] border-outline">Name / Summary</th>
              <th class="p-3 border-r-[2px] border-outline">Endpoint URL</th>
              <th class="p-3">Expected Status</th>
            </tr>
          </thead>
          <tbody class="divide-y-[2px] divide-outline">
            <tr v-for="(tc, idx) in importedCases" :key="idx" class="hover:bg-surface-dim text-sm">
              <td class="p-3 border-r-[2px] border-outline">
                <span :class="methodColors[tc.httpMethod] || 'bg-surface-container'" class="px-2 py-0.5 border-[2px] border-outline font-label text-[10px] uppercase">{{ tc.httpMethod }}</span>
              </td>
              <td class="p-3 border-r-[2px] border-outline font-bold max-w-[200px] truncate">{{ tc.title }}</td>
              <td class="p-3 border-r-[2px] border-outline font-mono text-xs max-w-[300px] truncate">{{ tc.endpointUrl }}</td>
              <td class="p-3 font-label">{{ tc.expectedStatus }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ======================== SAVED TESTS ======================== -->
  <div v-if="activeTab === 'history'" class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000]">
    <div class="p-4 border-b-[2px] border-outline flex items-center gap-2">
      <span class="material-symbols-outlined">api</span>
      <h2 class="font-headline uppercase text-sm">Saved API Test Cases ({{ testCases.length }})</h2>
    </div>

    <div v-if="!testCases.length" class="p-12 text-center text-on-surface-variant">
      <span class="material-symbols-outlined text-5xl block mb-3 opacity-30">cloud_off</span>
      <p class="font-label uppercase text-sm">No API test cases saved yet. Use Runner or Import to create some.</p>
    </div>

    <div class="divide-y-[2px] divide-outline">
      <div v-for="tc in testCases" :key="tc.id" class="flex items-center justify-between p-4 hover:bg-surface-dim">
        <div class="flex items-start gap-3">
          <span :class="methodColors[tc.httpMethod] || 'bg-surface-container'" class="px-2 py-1 border-[2px] border-outline font-label text-[10px] uppercase shrink-0 mt-0.5">{{ tc.httpMethod || 'GET' }}</span>
          <div>
            <p class="font-bold text-sm">{{ tc.title }}</p>
            <p class="font-mono text-xs text-on-surface-variant truncate max-w-md">{{ tc.endpointUrl }}</p>
            <p v-if="tc.project" class="text-[10px] text-on-surface-variant mt-0.5">📁 {{ tc.project.name }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-2 py-0.5 bg-surface-container border-[2px] border-outline font-label text-[10px] uppercase">{{ tc.expectedStatus || 200 }}</span>
          <button @click="loadTestCase(tc)" class="px-3 py-2 bg-[#93c5fd] border-[2px] border-outline font-label uppercase text-[10px] shadow-[2px_2px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">play_arrow</span> Load & Run
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
