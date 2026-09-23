<template>
  <div class="h-full bg-surface">
    <!-- Top Bar -->
    <div class="bg-surface-container border-b-[3px] border-outline p-gutter flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <h1 class="font-headline text-title-large uppercase flex items-center gap-2">
        <span class="material-symbols-outlined text-[32px]">menu_book</span> Documentation
      </h1>
    </div>

    <!-- Content -->
    <div class="p-gutter max-w-5xl mx-auto pb-20">

      <!-- Intro -->
      <div class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] p-6 mb-8">
        <h2 class="font-headline text-title-medium uppercase border-b-[2px] border-outline pb-2 mb-4">Pengenalan QA Track</h2>
        <p class="font-body text-body text-on-surface mb-3">
          QA Track adalah platform manajemen testing komprehensif yang dirancang untuk tim QA modern.
          Platform ini menghubungkan pengujian manual, automation, dan pelaporan ke dalam satu alur kerja terpusat.
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div v-for="item in overview" :key="item.label" class="border-[2px] border-outline p-3 bg-surface text-center">
            <span class="material-symbols-outlined text-primary text-[28px] block mb-1">{{ item.icon }}</span>
            <span class="font-label text-[10px] uppercase">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Hubungan antar modul -->
      <div class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] p-6 mb-8">
        <h2 class="font-headline text-title-medium uppercase border-b-[2px] border-outline pb-2 mb-4">Hubungan Antar Modul</h2>
        <div class="space-y-4">

          <div class="border-[2px] border-outline p-4 bg-surface">
            <h3 class="font-headline uppercase flex items-center gap-2 mb-2 text-sm">
              <span class="material-symbols-outlined text-primary">dashboard</span> Dashboard
            </h3>
            <p class="font-body text-sm">
              Menampilkan ringkasan kondisi proyek secara real-time: statistik Test Case (Passed, Failed, Draft, Ready), Automation Run terbaru, dan daftar Bug aktif.
              Dashboard mengagregasi data dari modul <strong>Test Cases</strong>, <strong>Bugs</strong>, dan <strong>Automation Runs</strong> secara otomatis.
            </p>
          </div>

          <div class="border-[2px] border-outline p-4 bg-surface">
            <h3 class="font-headline uppercase flex items-center gap-2 mb-2 text-sm">
              <span class="material-symbols-outlined text-primary">fact_check</span> Requirements
            </h3>
            <p class="font-body text-sm mb-2">
              Modul untuk mendefinisikan <strong>requirement bisnis atau sistem</strong>. Setiap requirement memiliki title, deskripsi, dan status (Open / In Progress / Done).
            </p>
            <p class="font-body text-sm text-on-surface-variant">
              <strong>Hubungan:</strong> Requirements menjadi dasar dari Test Case. Saat membuat Test Case, Anda dapat mengaitkannya ke satu atau lebih Requirement untuk melacak coverage. Data ini divisualisasikan di RTM.
            </p>
          </div>

          <div class="border-[2px] border-outline p-4 bg-surface">
            <h3 class="font-headline uppercase flex items-center gap-2 mb-2 text-sm">
              <span class="material-symbols-outlined text-primary">grid_view</span> RTM (Requirements Traceability Matrix)
            </h3>
            <p class="font-body text-sm mb-2">
              RTM adalah tabel pemetaan otomatis antara <strong>Requirement</strong> dan <strong>Test Case</strong> yang terhubung.
              Anda dapat melihat dengan jelas requirement mana yang sudah ter-cover, dan mana yang belum memiliki test case sama sekali.
            </p>
            <div class="bg-surface-variant p-3 border-[1px] border-outline font-mono text-[11px] my-2 leading-relaxed">
              Requirement A → Test Case 1 ✅, Test Case 2 ✅<br>
              Requirement B → (Belum ada Test Case) ❌<br>
              Requirement C → Test Case 3 ✅
            </div>
            <p class="font-body text-sm text-on-surface-variant">
              <strong>Hubungan:</strong> RTM dibaca otomatis dari data Requirements + Test Cases. Sangat berguna untuk audit kesiapan rilis dan verifikasi coverage.
            </p>
          </div>

          <div class="border-[2px] border-outline p-4 bg-surface">
            <h3 class="font-headline uppercase flex items-center gap-2 mb-2 text-sm">
              <span class="material-symbols-outlined text-primary">checklist</span> Test Cases
            </h3>
            <p class="font-body text-sm mb-2">
              Inti dari platform. Setiap Test Case bisa berupa pengujian Manual atau Automation (Playwright, Cypress, JMeter).
              Dapat dijalankan langsung dan hasilnya memperbarui Dashboard serta membuat Bug otomatis jika gagal.
            </p>
            <ul class="font-body text-sm list-disc pl-5 space-y-1 text-on-surface-variant">
              <li>Terhubung ke <strong>Requirements</strong> (untuk coverage di RTM)</li>
              <li>Dapat dieksekusi langsung (trigger Automation Run)</li>
              <li>Status tergambar di <strong>Dashboard</strong></li>
              <li>Jika gagal → Bug otomatis di modul <strong>Bugs</strong></li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Framework Cards -->
      <div class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] p-6 mb-8">
        <h2 class="font-headline text-title-medium uppercase border-b-[2px] border-outline pb-2 mb-4">Framework Automation & Report</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div class="border-[2px] border-outline p-4 bg-surface hover:border-primary transition-colors">
            <h3 class="font-headline uppercase flex items-center gap-2 mb-2 text-sm">
              <span class="material-symbols-outlined text-primary">play_circle</span> Playwright (E2E)
            </h3>
            <ul class="font-body text-sm list-disc pl-5 space-y-1">
              <li>Direktori: <code class="bg-surface-variant px-1">automation/playwright/tests/</code></li>
              <li>Output Report: <strong>Allure Report</strong> + <strong>HTML Report</strong></li>
              <li>Mendukung No-Code Builder, BDD, Script Mapping</li>
            </ul>
          </div>

          <div class="border-[2px] border-outline p-4 bg-surface hover:border-primary transition-colors">
            <h3 class="font-headline uppercase flex items-center gap-2 mb-2 text-sm">
              <span class="material-symbols-outlined text-primary">bug_report</span> Cypress (E2E)
            </h3>
            <ul class="font-body text-sm list-disc pl-5 space-y-1">
              <li>Direktori: <code class="bg-surface-variant px-1">automation/cypress/cypress/e2e/</code></li>
              <li>Output Report: <strong>HTML Report</strong> (Mochawesome)</li>
              <li>Mendukung No-Code Builder, Script Mapping</li>
            </ul>
          </div>

          <div class="border-[2px] border-outline p-4 bg-surface hover:border-primary transition-colors md:col-span-2">
            <h3 class="font-headline uppercase flex items-center gap-2 mb-2 text-sm">
              <span class="material-symbols-outlined text-primary">speed</span> JMeter (Performance)
            </h3>
            <ul class="font-body text-sm list-disc pl-5 space-y-1">
              <li>Direktori Script: <code class="bg-surface-variant px-1">automation/jmeter/scripts/</code></li>
              <li>Output: <code class="bg-surface-variant px-1">automation/jmeter/results/*.jtl</code></li>
              <li>Report dapat dilihat & diunduh (.jtl) dari menu <strong>JMeter Report</strong></li>
              <li>Hanya mendukung Script Mapping</li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Alur Kerja -->
      <div class="bg-surface-container-lowest border-[3px] border-outline shadow-[4px_4px_0px_#000000] p-6 mb-8">
        <h2 class="font-headline text-title-medium uppercase border-b-[2px] border-outline pb-2 mb-4">Alur Kerja (Workflow)</h2>
        <div class="space-y-3">

          <details class="border-[2px] border-outline p-4 group cursor-pointer bg-surface" open>
            <summary class="font-headline uppercase flex justify-between items-center select-none text-sm">
              1. Define Requirements
              <span class="material-symbols-outlined group-open:-rotate-180 transition-transform">expand_more</span>
            </summary>
            <div class="mt-3 pt-3 border-t-[1px] border-outline font-body text-sm">
              Daftarkan semua kebutuhan fitur di modul <strong>Requirements</strong>. Ini menjadi dasar cakupan pengujian. Tanpa ini, RTM tidak akan bisa dipetakan.
            </div>
          </details>

          <details class="border-[2px] border-outline p-4 group cursor-pointer bg-surface">
            <summary class="font-headline uppercase flex justify-between items-center select-none text-sm">
              2. Buat & Hubungkan Test Cases
              <span class="material-symbols-outlined group-open:-rotate-180 transition-transform">expand_more</span>
            </summary>
            <div class="mt-3 pt-3 border-t-[1px] border-outline font-body text-sm">
              Buat Test Case dan pilih Requirement yang ingin dicakup. Status Test Case akan terlihat langsung di Dashboard dan terdata di RTM.
            </div>
          </details>

          <details class="border-[2px] border-outline p-4 group cursor-pointer bg-surface">
            <summary class="font-headline uppercase flex justify-between items-center select-none text-sm">
              3. Eksekusi & Monitor
              <span class="material-symbols-outlined group-open:-rotate-180 transition-transform">expand_more</span>
            </summary>
            <div class="mt-3 pt-3 border-t-[1px] border-outline font-body text-sm">
              Jalankan test dari menu <strong>Test Cases</strong> atau <strong>Automation</strong>. Notifikasi dikirim via Telegram & In-App. Jika gagal, Bug otomatis terbuat. Laporan tersedia di Allure, HTML Report, atau JMeter Report.
            </div>
          </details>

          <details class="border-[2px] border-outline p-4 group cursor-pointer bg-surface">
            <summary class="font-headline uppercase flex justify-between items-center select-none text-sm">
              4. Verifikasi RTM & Export Laporan
              <span class="material-symbols-outlined group-open:-rotate-180 transition-transform">expand_more</span>
            </summary>
            <div class="mt-3 pt-3 border-t-[1px] border-outline font-body text-sm">
              Buka <strong>RTM</strong> untuk memverifikasi semua requirement sudah ter-cover Test Case. Buka <strong>Reports</strong> untuk generate snapshot dan export PDF. Gunakan <strong>Dashboard</strong> untuk memantau kondisi keseluruhan project.
            </div>
          </details>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const overview = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Test Cases', icon: 'checklist' },
  { label: 'Requirements', icon: 'fact_check' },
  { label: 'RTM', icon: 'grid_view' },
  { label: 'Automation', icon: 'smart_toy' },
  { label: 'Bug Tracker', icon: 'pest_control' },
  { label: 'Reports', icon: 'monitoring' },
  { label: 'Notifications', icon: 'notifications' },
]
</script>
