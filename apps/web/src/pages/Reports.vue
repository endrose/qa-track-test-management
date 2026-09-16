<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const reports = ref<any[]>([])
const projects = ref<any[]>([])
const testCases = ref<any[]>([])
const isGenerating = ref(false)
const selectedProjectId = ref('')
const isExporting = ref(false)

const fetchReports = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/reports')
    if (res.ok) {
      reports.value = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch reports', error)
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

const fetchTestCases = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/test-cases')
    if (res.ok) testCases.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch test cases', err)
  }
}

const generateReport = async () => {
  isGenerating.value = true
  try {
    const reportName = `Snapshot - ${new Date().toLocaleString()}`
    const res = await fetch('http://127.0.0.1:3000/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: reportName,
        project: selectedProjectId.value ? { id: selectedProjectId.value } : null
      })
    })
    if (res.ok) {
      await fetchReports()
    }
  } catch (error) {
    console.error('Failed to generate report', error)
  } finally {
    isGenerating.value = false
  }
}

// Live stats from current test cases
const filteredTestCases = computed(() => {
  if (!selectedProjectId.value) return testCases.value
  return testCases.value.filter((tc: any) => tc.project?.id === selectedProjectId.value)
})

const livePassed = computed(() => filteredTestCases.value.filter((tc: any) => tc.status === 'Passed').length)
const liveFailed = computed(() => filteredTestCases.value.filter((tc: any) => tc.status === 'Failed').length)
const liveReady = computed(() => filteredTestCases.value.filter((tc: any) => tc.status === 'Ready').length)
const liveDraft = computed(() => filteredTestCases.value.filter((tc: any) => tc.status === 'Draft').length)
const liveTotal = computed(() => filteredTestCases.value.length)
const livePassRate = computed(() => liveTotal.value === 0 ? 0 : Math.round((livePassed.value / liveTotal.value) * 100))

const selectedProjectName = computed(() => {
  if (!selectedProjectId.value) return 'All Projects'
  return projects.value.find(p => p.id === selectedProjectId.value)?.name || 'All Projects'
})

// PDF Export
const exportToPdf = () => {
  isExporting.value = true

  // Build HTML content for printing
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>QA Track - Test Report</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 32px; background: #fff; }
        
        .header { border-bottom: 3px solid #000; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
        .header h1 { font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; }
        .header .meta { text-align: right; font-size: 11px; color: #555; }
        .header .meta .badge { display: inline-block; background: #000; color: #fff; padding: 2px 8px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }

        .section { margin-bottom: 28px; }
        .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }

        .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 16px; }
        .stat-card { border: 2px solid #000; padding: 12px; box-shadow: 3px 3px 0 #000; }
        .stat-card .label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #555; }
        .stat-card .value { font-size: 36px; font-weight: 900; margin-top: 4px; }
        .stat-passed { background: #86efac; }
        .stat-failed { background: #fca5a5; }
        .stat-ready { background: #93c5fd; }
        .stat-draft { background: #f1f5f9; }
        .stat-rate { background: #fde047; }

        .progress-bar { height: 12px; border: 2px solid #000; display: flex; overflow: hidden; margin-bottom: 8px; }
        .progress-passed { background: #86efac; }
        .progress-failed { background: #fca5a5; }
        .progress-ready { background: #93c5fd; }
        .progress-draft { background: #e2e8f0; flex: 1; }

        .legend { display: flex; gap: 16px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
        .legend-item { display: flex; align-items: center; gap: 4px; }
        .legend-dot { width: 10px; height: 10px; border: 1px solid #000; }

        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #1a1a1a; color: #fff; padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
        td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
        tr:nth-child(even) td { background: #f8fafc; }
        .badge-project { background: #93c5fd; padding: 2px 6px; font-size: 9px; font-weight: 700; text-transform: uppercase; border: 1px solid #000; }
        .text-passed { color: #15803d; font-weight: 700; }
        .text-failed { color: #dc2626; font-weight: 700; }
        .text-muted { color: #64748b; }

        .test-cases-table { margin-top: 20px; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 2px solid #000; display: flex; justify-content: space-between; font-size: 10px; color: #555; }
        
        @media print {
          body { padding: 16px; }
          .stat-card { box-shadow: 2px 2px 0 #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .stat-passed { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #86efac !important; }
          .stat-failed { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fca5a5 !important; }
          .stat-ready { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #93c5fd !important; }
          .stat-rate { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fde047 !important; }
          .progress-passed { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #86efac !important; }
          .progress-failed { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fca5a5 !important; }
          .progress-ready { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #93c5fd !important; }
          th { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #1a1a1a !important; color: #fff !important; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#555; margin-bottom:4px;">QA Track Test Management</div>
          <h1>Test Report</h1>
          <div style="font-size:12px; margin-top:6px; font-weight:500;">Project: <strong>${selectedProjectName.value}</strong></div>
        </div>
        <div class="meta">
          <div class="badge">Official Report</div>
          <div>Generated: ${new Date().toLocaleString()}</div>
          <div style="margin-top:2px;">Total Test Cases: <strong>${liveTotal.value}</strong></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📊 Live Test Case Summary</div>
        <div class="stats-grid">
          <div class="stat-card stat-passed">
            <div class="label">Passed</div>
            <div class="value">${livePassed.value}</div>
          </div>
          <div class="stat-card stat-failed">
            <div class="label">Failed</div>
            <div class="value">${liveFailed.value}</div>
          </div>
          <div class="stat-card stat-ready">
            <div class="label">Ready</div>
            <div class="value">${liveReady.value}</div>
          </div>
          <div class="stat-card stat-draft">
            <div class="label">Draft</div>
            <div class="value">${liveDraft.value}</div>
          </div>
          <div class="stat-card stat-rate">
            <div class="label">Pass Rate</div>
            <div class="value">${livePassRate.value}%</div>
          </div>
        </div>
        ${liveTotal.value > 0 ? `
        <div class="progress-bar">
          <div class="progress-passed" style="width:${livePassed.value / liveTotal.value * 100}%"></div>
          <div class="progress-failed" style="width:${liveFailed.value / liveTotal.value * 100}%"></div>
          <div class="progress-ready" style="width:${liveReady.value / liveTotal.value * 100}%"></div>
          <div class="progress-draft"></div>
        </div>
        <div class="legend">
          <div class="legend-item"><div class="legend-dot" style="background:#86efac;"></div> Passed</div>
          <div class="legend-item"><div class="legend-dot" style="background:#fca5a5;"></div> Failed</div>
          <div class="legend-item"><div class="legend-dot" style="background:#93c5fd;"></div> Ready</div>
          <div class="legend-item"><div class="legend-dot" style="background:#e2e8f0;"></div> Draft</div>
        </div>` : '<p style="color:#64748b;font-size:11px;margin-top:8px;">No test cases found.</p>'}
      </div>

      <div class="section test-cases-table">
        <div class="section-title">📋 Test Case Details</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Project</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Automation</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTestCases.value.map((tc: any, i: number) => `
              <tr>
                <td class="text-muted">${i + 1}</td>
                <td><strong>${tc.title}</strong>${tc.description ? `<br><span style="font-size:10px;color:#64748b;">${tc.description}</span>` : ''}</td>
                <td>${tc.project ? `<span class="badge-project">${tc.project.name}</span>` : '<span class="text-muted">—</span>'}</td>
                <td style="font-size:10px;text-transform:uppercase;font-weight:600;">${tc.testType || 'Functional'}</td>
                <td style="font-size:10px;text-transform:uppercase;font-weight:600;">${tc.priority}</td>
                <td class="${tc.status === 'Passed' ? 'text-passed' : tc.status === 'Failed' ? 'text-failed' : 'text-muted'}" style="text-transform:uppercase;font-size:10px;">
                  ${tc.status === 'Passed' ? '✓ ' : tc.status === 'Failed' ? '✗ ' : ''}${tc.status}
                </td>
                <td style="font-size:10px;">${tc.automationType !== 'none' ? `${tc.automationTool?.toUpperCase() || ''} · ${tc.automationScript || tc.automationType}` : 'Manual'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${reports.value.length > 0 ? `
      <div class="section" style="margin-top:24px; page-break-before: auto;">
        <div class="section-title">🗂 Report Snapshots History</div>
        <table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Project</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Not Run</th>
              <th>Summary</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${reports.value.map((r: any) => `
              <tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.project ? `<span class="badge-project">${r.project.name}</span>` : '<span class="text-muted">All Projects</span>'}</td>
                <td class="text-passed">${r.passed}</td>
                <td class="text-failed">${r.failed}</td>
                <td class="text-muted">${r.skipped}</td>
                <td style="font-size:10px;color:#555;">${r.summary || '—'}</td>
                <td class="text-muted">${new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>` : ''}

      <div class="footer">
        <div>QA Track Test Management System &bull; Confidential</div>
        <div>Generated on ${new Date().toLocaleString()}</div>
      </div>
    </body>
    </html>
  `

  const printWindow = window.open('', '_blank', 'width=1200,height=900')
  if (!printWindow) {
    alert('Popup blocked! Please allow popups for this site to export PDF.')
    isExporting.value = false
    return
  }

  printWindow.document.write(printContent)
  printWindow.document.close()

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      isExporting.value = false
    }, 300)
  }
}

onMounted(() => {
  fetchReports()
  fetchProjects()
  fetchTestCases()
})
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000] mb-4">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-0.5 bg-primary text-on-primary font-label uppercase text-[10px] tracking-widest border-[2px] border-outline w-fit">Analytics</span>
      <h1 class="font-display text-display text-on-surface tracking-tight uppercase">Test Reports</h1>
    </div>
    <div class="flex items-center gap-3 flex-wrap">
      <select v-model="selectedProjectId" @change="fetchTestCases" class="px-3 py-2 bg-surface border-[2px] border-outline font-body focus:outline-none shadow-[2px_2px_0px_#000000] text-sm">
        <option value="">All Projects</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <button 
        @click="generateReport" 
        :disabled="isGenerating"
        class="px-4 py-2 bg-[#93c5fd] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined text-[18px]">add_chart</span> 
        {{ isGenerating ? 'Generating...' : 'Generate Snapshot' }}
      </button>
      <button 
        @click="exportToPdf" 
        :disabled="isExporting"
        class="px-4 py-2 bg-[#fde047] text-on-surface font-label uppercase border-[2px] border-outline shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span> 
        {{ isExporting ? 'Preparing...' : 'Export PDF' }}
      </button>
    </div>
  </div>

  <!-- Live Stats from Test Cases -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000] mb-4">
    <h2 class="font-headline text-headline uppercase flex items-center gap-2 mb-4 pb-2 border-b-[2px] border-outline">
      <span class="material-symbols-outlined">assignment</span>
      Live Test Case Status
      <span class="ml-2 text-[10px] font-label font-normal text-on-surface-variant border-[2px] border-outline px-2 py-0.5">{{ selectedProjectName }}</span>
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
      <div class="bg-[#86efac] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Passed</span>
        <span class="font-display text-display font-black">{{ livePassed }}</span>
      </div>
      <div class="bg-[#fca5a5] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Failed</span>
        <span class="font-display text-display font-black">{{ liveFailed }}</span>
      </div>
      <div class="bg-[#93c5fd] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Ready</span>
        <span class="font-display text-display font-black">{{ liveReady }}</span>
      </div>
      <div class="bg-surface border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Draft</span>
        <span class="font-display text-display font-black">{{ liveDraft }}</span>
      </div>
      <div class="bg-[#fde047] border-[3px] border-outline p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
        <span class="font-label uppercase text-[10px]">Pass Rate</span>
        <span class="font-display text-display font-black">{{ livePassRate }}%</span>
      </div>
    </div>
    <!-- Progress Bar -->
    <div class="flex h-4 border-[2px] border-outline overflow-hidden mt-3" v-if="liveTotal > 0">
      <div class="bg-[#86efac] transition-all" :style="{ width: (livePassed/liveTotal*100) + '%' }" :title="`Passed: ${livePassed}`"></div>
      <div class="bg-[#fca5a5] transition-all" :style="{ width: (liveFailed/liveTotal*100) + '%' }" :title="`Failed: ${liveFailed}`"></div>
      <div class="bg-[#93c5fd] transition-all" :style="{ width: (liveReady/liveTotal*100) + '%' }" :title="`Ready: ${liveReady}`"></div>
      <div class="bg-surface-dim flex-1" :title="`Draft: ${liveDraft}`"></div>
    </div>
    <div class="flex gap-4 mt-2" v-if="liveTotal > 0">
      <span class="font-label text-[9px] uppercase flex items-center gap-1"><span class="w-3 h-3 bg-[#86efac] border border-outline inline-block"></span>Passed</span>
      <span class="font-label text-[9px] uppercase flex items-center gap-1"><span class="w-3 h-3 bg-[#fca5a5] border border-outline inline-block"></span>Failed</span>
      <span class="font-label text-[9px] uppercase flex items-center gap-1"><span class="w-3 h-3 bg-[#93c5fd] border border-outline inline-block"></span>Ready</span>
      <span class="font-label text-[9px] uppercase flex items-center gap-1"><span class="w-3 h-3 bg-surface-dim border border-outline inline-block"></span>Draft</span>
    </div>
    <div v-else class="text-center font-label uppercase text-[10px] text-on-surface-variant py-4">No test cases found for selected filter.</div>
  </div>

  <!-- Report History -->
  <div class="bg-surface-container-lowest border-[3px] border-outline p-gutter shadow-[4px_4px_0px_#000000]">
    <div class="flex items-center justify-between mb-4 pb-2 border-b-[2px] border-outline">
      <h2 class="font-headline text-headline uppercase flex items-center gap-2">
        <span class="material-symbols-outlined">history</span> Report Snapshots
      </h2>
      <span class="font-label text-[10px] text-on-surface-variant">{{ reports.length }} snapshot(s)</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border-[2px] border-outline">
        <thead>
          <tr class="bg-primary text-on-primary font-label uppercase text-label">
            <th class="p-3 border-r-[2px] border-outline">Report Name</th>
            <th class="p-3 border-r-[2px] border-outline">Project</th>
            <th class="p-3 border-r-[2px] border-outline">Summary</th>
            <th class="p-3 border-r-[2px] border-outline">Passed</th>
            <th class="p-3 border-r-[2px] border-outline">Failed</th>
            <th class="p-3 border-r-[2px] border-outline">Not Run</th>
            <th class="p-3">Created At</th>
          </tr>
        </thead>
        <tbody class="font-body text-body divide-y-[2px] divide-outline">
          <tr v-if="reports.length === 0">
            <td colspan="7" class="p-6 text-center font-label uppercase text-on-surface-variant">No snapshots yet. Click "Generate Snapshot" to save the current state.</td>
          </tr>
          <tr v-for="report in reports" :key="report.id" class="hover:bg-surface-container transition-colors">
            <td class="p-3 border-r-[2px] border-outline font-bold">{{ report.name }}</td>
            <td class="p-3 border-r-[2px] border-outline">
              <span v-if="report.project" class="px-2 py-0.5 bg-[#93c5fd] border-[2px] border-outline font-label uppercase text-[10px]">{{ report.project.name }}</span>
              <span v-else class="text-on-surface-variant text-[10px]">All Projects</span>
            </td>
            <td class="p-3 border-r-[2px] border-outline text-label text-on-surface-variant">{{ report.summary || '-' }}</td>
            <td class="p-3 border-r-[2px] border-outline text-[#15803d] font-bold">{{ report.passed }}</td>
            <td class="p-3 border-r-[2px] border-outline text-error font-bold">{{ report.failed }}</td>
            <td class="p-3 border-r-[2px] border-outline text-on-surface-variant">{{ report.skipped }}</td>
            <td class="p-3">{{ new Date(report.createdAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
