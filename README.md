# QA Track — Test Management Platform

> Platform manajemen testing yang komprehensif untuk tim QA modern. Dirancang untuk menjembatani manual testing dan automation testing melalui No-Code builder, BDD support, dan eksekusi lokal yang terintegrasi.

---

## 🌟 Fitur Unggulan

| Fitur | Deskripsi |
|---|---|
| **Project & Test Case Management** | Kelola proyek, buat test cases dengan prioritas/status, dan lacak progress dari Draft hingga Passed |
| **Step Builder (No-Code)** | Buat automation script tanpa menulis kode menggunakan visual step builder |
| **BDD (Gherkin)** | Tulis test dalam format Given/When/Then dan generate skeleton script otomatis |
| **Smart UI Scanner** | Scan URL manapun untuk mengekstrak locators (CSS, ID, XPath, Text) menggunakan Playwright headless |
| **Playwright, Cypress, & JMeter** | Generate dan jalankan test E2E atau Performance Test (`.jmx`) langsung dari dashboard |
| **Script Editor Terintegrasi** | Edit script di browser dengan syntax autocomplete dan kamus fungsi |
| **Eksekusi Lokal** | Jalankan test dan pantau output real-time langsung dari UI |
| **Test Reports & Viewer** | Lihat live status, export PDF, dan parse JMeter `.jtl` reports langsung ke dalam tabel UI |
| **Bug Tracker** | Bug otomatis dibuat saat test gagal, lengkap dengan log dan screenshot |
| **Allure & HTML Reports** | Generate dan serve Allure & Native Playwright HTML Report terisolasi per-project setelah eksekusi test |
| **Telegram & In-App Notifications** | Notifikasi *real-time* via Telegram Bot & Web UI Socket.io setiap kali Automation Run selesai/gagal |
| **Auth & User Management** | Login dengan bcrypt-encrypted password, invite user, atur role, dan kelola integrasi pihak ketiga |
| **API Testing & OpenAPI/Postman Importer** | Impor koleksi Postman (.json) atau file OpenAPI/Swagger (.json/.yaml) untuk membuat API Test Case otomatis, menguji endpoint, dan memvalidasi response code/schema |
| **Root Cause Analysis (RCA) & Log Viewer** | Klasifikasikan kategori penyebab bug (Backend, DB, UI, Network, Env) dan lampirkan berkas log server (.log, .har) langsung di detail bug |

---

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | Vue 3 (Composition API), Vite, Tailwind CSS, Vue Router |
| **Backend** | NestJS, TypeORM, PostgreSQL, bcrypt |
| **Automation** | Playwright, Cypress, JMeter, Allure CLI |
| **Monorepo** | Turborepo, npm Workspaces |

---

## 🚀 Cara Menjalankan (Getting Started)

### Prasyarat
- **Node.js** v18 atau lebih baru
- **npm** v9 atau lebih baru
- **PostgreSQL** — database yang digunakan untuk menyimpan data
- **Java** — diperlukan untuk generate Allure Report dan menjalankan JMeter
- **Apache JMeter** — (Opsional) diperlukan jika ingin menjalankan skrip Performance Test (`.jmx`)

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/your-org/qa-track-test-management.git
cd qa-track-test-management

# Install semua dependencies (monorepo)
npm install
```

### 2. Setup Database

Buat database PostgreSQL kosong dan sesuaikan konfigurasi di `.env` (gunakan file `.env.example` sebagai referensi):

```bash
# Copy file env example
cp apps/api/.env.example apps/api/.env

# Edit apps/api/.env dan sesuaikan dengan kredensial database Anda
DATABASE_URL=postgresql://username:password@localhost:5432/qatrack
```

> **Catatan Database:** Anda hanya perlu membuat database kosong. Seluruh *table* dan struktur data akan dibuat secara otomatis oleh NestJS (TypeORM `synchronize`) ketika *backend* dijalankan pertama kali.

### 3. Jalankan Dev Server

```bash
# Jalankan frontend + backend secara bersamaan
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://127.0.0.1:3000`
- **Allure Report**: `http://127.0.0.1:3000/allure`

### 4. Login Pertama Kali

Saat backend pertama kali dijalankan, akun admin otomatis dibuat:

| Field | Value |
|---|---|
| Email | `admin@qatrack.com` |
| Password | `password` |

> ⚠️ Segera ganti password melalui menu **Settings → Users** setelah login pertama.

---

## 🗺️ Panduan Penggunaan

### Alur Kerja Dasar (Manual Testing)

```
1. Buat Project          → Dashboard → Projects → "+ New Project"
2. Buat Test Case        → Test Cases → "+ Create" → isi Title, Description, Type, Priority
3. Tandai Status         → Edit test case → ubah status ke Ready / Passed / Failed
4. Lapor Bug             → Bugs → "+ New Bug" atau otomatis dari test yang gagal
5. Generate Report       → Reports → "Generate Snapshot" → "Export PDF"
```

### Alur Kerja Automation — No-Code Builder

```
1. Buat / Edit Test Case
2. Pilih Automation Type: "Step Builder (No-Code)"
3. Pilih Framework: Playwright, Cypress, atau JMeter
4. (Opsional) Masukkan URL → klik "Scan" untuk auto-detect locators
5. Tambah langkah: Navigate, Click, Fill, Assert, dll.
6. Klik "Generate Script" → file .spec.ts / .cy.ts / .jmx otomatis dibuat
7. Klik "Run" pada test case untuk menjalankan test
8. Pantau output di Execution Panel atau Report Viewer
```

### Alur Kerja Automation — BDD (Gherkin)

```
1. Buat / Edit Test Case
2. Pilih Automation Type: "BDD (Gherkin)"
3. Pilih Framework: Playwright atau Cypress
4. Tulis Gherkin script di text area:

   Feature: Login
     Scenario: Login dengan kredensial valid
       Given saya berada di halaman login
       When saya memasukkan email yang valid
       Then saya diarahkan ke dashboard

5. Klik "Generate Script Skeleton"
6. Buka "Manage Scripts" → Edit → lengkapi implementasi setiap step
7. Klik "Run" untuk mengeksekusi
```

### Alur Kerja Automation — Script Mapping (Termasuk JMeter)

```
1. Tulis test script manual di folder:
   - Playwright: `automation/playwright/tests/`
   - Cypress:    `automation/cypress/cypress/e2e/`
   - JMeter:     `automation/jmeter/scripts/`
2. Buka "Manage Scripts" untuk melihat daftar file (Edit fitur didukung)
3. Pada Test Case, pilih Automation Type: "Script Mapping"
4. Pilih Tool yang sesuai (misal: JMeter (Performance))
5. Isi nama file script (misal: `login-performance-test.jmx`)
6. Klik "Run" untuk menjalankan
7. Hasil JMeter (`.jtl`) bisa dibaca langsung melalui modal Report di menu **Automation**
```

### Generate & Export Report

```
1. Buka halaman Reports
2. (Opsional) Filter berdasarkan Project
3. Lihat Live Status — Passed, Failed, Ready, Draft secara real-time
4. Klik "Generate Snapshot" untuk menyimpan state saat ini ke history
5. Klik "Export PDF" untuk mengunduh laporan lengkap dalam format PDF
```

### Alur Kerja API Testing & Import

```
1. Buka Project → Menu Test Cases atau API Testing
2. Klik "Import API Spec" → Pilih Postman Collection (.json) atau OpenAPI/Swagger (.yaml/.json)
3. Sistem otomatis melakukan parsing & generate daftar API Test Case per Endpoint
4. Atur Environment Variables (misal: {{baseUrl}}, Auth Token)
5. Eksekusi API Test Case → Sistem memvalidasi Status Code, Response Body, & Response Time
6. Jika terjadi kesalahan/mismatch schema, bug otomatis terbuat
```

### Alur Kerja Root Cause Analysis (RCA) pada Bug

```
1. Saat Test Case gagal (UI, API, atau Performance), Bug otomatis dibuat (atau buat manual via "+ New Bug")
2. Pada Form Bug Detail, isi bidang RCA:
   - Root Cause Category (misal: Backend API / Database Issue / UI Regression / Environment)
   - Root Cause Details (penjelasan teknis penyebab utama masalah)
3. Attach/Upload file pendukung tambahan:
   - File Log Server (.log, .txt)
   - Network Log (.har) atau Screenshot
4. Tim Developer dapat langsung mengisolasi masalah berdasarkan kategori RCA dan file log yang tersedia
```

### Memantau Test Automation Report (Per Project)

```
Aplikasi kini menyediakan halaman laporan khusus yang terisolasi secara otomatis berdasarkan project yang sedang kamu pilih di top-bar:
- Allure Report: Laporan eksekusi interaktif (Sidebar > Allure Report)
- HTML Report: Laporan native Playwright HTML (Sidebar > HTML Report)
- JMeter Report: Parsing hasil .jtl performa ke dalam tabel metrik (Sidebar > JMeter Report)
```

### Setup Integrasi Notifikasi (Telegram)

```
Aplikasi mendukung pengiriman notifikasi saat Automation Run gagal atau sukses.
1. Buka halaman Settings -> Tab Integrations
2. Nyalakan Toggle Telegram Bot Integration
3. Isi Bot Token (dari @BotFather, contoh: 1234567890:AAHfRK...)
4. Isi Chat ID. Untuk mendapatkan Chat ID:
   - Buat grup Telegram dan masukkan Bot Anda ke grup tersebut
   - Masukkan bot @RawDataBot ke dalam grup tersebut
   - @RawDataBot akan membalas dengan sebuah JSON. Cari nilai id pada bagian "chat": { "id": -100123456789, ... }
   - Masukkan nilai id tersebut (termasuk tanda minus jika ada) ke field Chat ID
5. Klik Save Telegram Config
Data akan otomatis tersimpan di database dan langsung berlaku (tanpa merestart server).
```

### Setup Integrasi Email Invite (Resend)

```
Aplikasi mendukung pengiriman email selamat datang berisi kredensial (password) kepada pengguna yang di-invite.
1. Buat akun di https://resend.com/
2. Dapatkan API Key di dashboard (berawalan re_...)
3. Buka file apps/api/.env dan tambahkan kredensial berikut:
   MAIL_RESEND_KEY="re_KODE_API_KEY_ANDA"
4. Restart backend server.
5. Ketika Anda meng-invite member di Settings -> Team, email otomatis akan dikirim ke alamat yang didaftarkan.
```

---

## 📁 Struktur Workspace

```
qa-track-test-management/
├── apps/
│   ├── web/                    # Frontend Vue 3
│   │   └── src/
│   │       ├── pages/          # Halaman: Dashboard, TestCases, Reports, Bugs, dll.
│   │       ├── components/     # Komponen reusable
│   │       └── router/         # Vue Router config
│   └── api/                    # Backend NestJS
│       └── src/
│           ├── auth/           # Login & User management
│           ├── projects/       # Project CRUD
│           ├── test-cases/     # Test Case CRUD
│           ├── automation/     # Script generation & execution
│           ├── test-reports/   # Report generation
│           └── bugs/           # Bug tracking
├── automation/
│   ├── playwright/
│   │   ├── tests/              # ← Simpan file .spec.ts di sini
│   │   ├── scripts/            # Scanner & utilities
│   │   ├── allure-results/     # Output Allure
│   │   └── playwright.config.ts
│   ├── cypress/
│   │   └── cypress/
│   │       ├── e2e/            # ← Simpan file .cy.ts di sini
│   │       └── fixtures/
│   └── jmeter/
│       ├── scripts/            # ← Simpan file .jmx di sini
│       └── results/            # Output laporan .jtl
├── packages/
│   └── database/
│       └── entities/           # TypeORM entities (User, TestCase, Bug, dll.)
└── docs/                       # Dokumentasi (tidak diupload ke GitHub)
```

---

## 🗄️ Penyesuaian Struktur Database / Entity (Overview)

Untuk mendukung fitur API Testing & RCA, berikut adalah ekstensi struktur database:

**Entity Bug / Defect (Tambahan Field):**
- `rootCauseCategory`: Enum (BACKEND_API, DATABASE, FRONTEND_UI, NETWORK_INFRA, ENVIRONMENT_CONFIG, THIRD_PARTY)
- `rootCauseDescription`: text (penjelasan akar masalah)
- `logAttachments`: Array of file metadata/paths (penyimpanan log .log / .har)

**Entity ApiTestCase / ApiCollection (Modul Baru/Ekstensi):**
- `endpointUrl`: String
- `httpMethod`: Enum (GET, POST, PUT, DELETE, dll)
- `headers`: JSON
- `requestBody`: JSON / Text
- `expectedStatus`: Number
- `expectedSchema`: JSON

---

## 💡 Scripts yang Tersedia

```bash
# Monorepo (dari root)
npm run dev          # Jalankan semua dev server (frontend + backend)
npm run build        # Build semua workspace
npm run clean        # Hapus node_modules dan dist di semua workspace

# Frontend saja (apps/web)
npm run dev          # Vite dev server di port 5173

# Backend saja (apps/api)
npm run start:dev    # NestJS dev server dengan hot-reload di port 3000

# Playwright (automation/playwright)
npx playwright test                     # Jalankan semua test
npx playwright test tests/login.spec.ts # Jalankan satu file
npx playwright show-report              # Buka HTML report
npx allure generate allure-results -o allure-report --clean
npx allure open allure-report

# Cypress (automation/cypress)
npx cypress run                          # Headless run
npx cypress open                         # Interactive mode
npx cypress run --spec "cypress/e2e/login.cy.ts"  # Run satu file
```

---

## 🔐 Keamanan

- Password disimpan menggunakan **bcrypt** (cost factor 12) — tidak pernah plaintext
- Field `passwordHash` tidak pernah dikirim ke frontend
- Untuk migrasi dari password plaintext lama, jalankan:
  ```sql
  -- apps/api/migrate-passwords.sql
  UPDATE users
  SET "passwordHash" = '$2b$12$...'  -- bcrypt hash dari password lama
  WHERE "passwordHash" NOT LIKE '$2%';
  ```

---

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m "feat: tambah fitur X"`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan pembelajaran dan komersial.
