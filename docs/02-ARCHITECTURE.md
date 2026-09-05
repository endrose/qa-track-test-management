# QATrack — Architecture

## 1. Architecture Overview

QATrack menggunakan arsitektur **Turborepo Monorepo** dengan npm workspaces, memisahkan aplikasi (`apps/`), package yang dapat dipakai bersama (`packages/`), automation runner (`automation/`), dokumentasi (`docs/`), dan konfigurasi infrastructure (`infrastructure/`) dalam satu repository.

```
Vue 3 Frontend (apps/web)
        ↓
NestJS REST API (apps/api)
        ↓
PostgreSQL (via packages/database)
```

```
Automation:
Playwright / Cypress (automation/)
        ↓
Automation Runner
        ↓
QATrack API (apps/api)
        ↓
Test Results / Evidence
```

```
CI/CD:
GitHub Actions / GitLab CI / Jenkins
        ↓
Turborepo Pipeline (turbo.json)
        ↓
Automation Runner
        ↓
QATrack
```

## 2. Monorepo Structure

```
qatrack/
├── apps/
│   ├── web/                   # Vue 3 + TypeScript + Vite
│   └── api/                   # NestJS + TypeScript
│
├── packages/
│   ├── database/              # TypeORM entities + migrations
│   ├── shared-types/          # Shared DTO/types (FE ↔ BE)
│   ├── api-client/            # Frontend API client (typed, dipakai oleh apps/web)
│   ├── eslint-config/         # Shared ESLint config
│   └── tsconfig/              # Shared base tsconfig
│
├── automation/
│   ├── playwright/
│   └── cypress/
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE-SCHEMA.md
│   ├── API.md
│   └── UI-UX.md
│
├── infrastructure/
│   └── docker/
│
├── package.json                # Root workspace config (npm workspaces)
├── turbo.json                  # Turborepo pipeline config
├── package-lock.json
├── docker-compose.yml
├── .env.example
└── README.md
```

### Package manager

Monorepo ini menggunakan **npm workspaces** (bukan pnpm/yarn). Root `package.json`:

```json
{
  "name": "qatrack",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "db:migrate": "npm run migration:run --workspace=packages/database"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  }
}
```

`turbo.json` dasar:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".output/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

Karena pakai npm workspaces, dependency antar package cukup direferensikan lewat `"dependency-name": "*"` di `package.json` masing-masing app/package, lalu jalankan `npm install` dari root — npm akan otomatis symlink package lokal ke `node_modules`.

## 3. Frontend (`apps/web`)

Technology:
- Vue 3
- TypeScript
- Pinia
- Vue Router
- Vite
- Component-based UI
- Mengonsumsi `packages/api-client` dan `packages/shared-types`

Struktur:

```
apps/web/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── modules/
│   ├── stores/
│   ├── services/          # thin wrapper di atas packages/api-client
│   ├── router/
│   └── types/
├── vite.config.ts
├── tsconfig.json           # extends packages/tsconfig
└── package.json
```

Feature modules:
- dashboard
- projects
- requirements
- scenarios
- test-cases
- executions
- automation
- bugs
- reports
- settings

## 4. Backend (`apps/api`)

Technology:
- NestJS
- TypeScript
- PostgreSQL (via `packages/database`)

Struktur:

```
apps/api/
├── src/
│   ├── auth/
│   ├── users/
│   ├── projects/
│   ├── requirements/
│   ├── scenarios/
│   ├── test-cases/
│   ├── executions/
│   ├── automation/
│   ├── bugs/
│   ├── reports/
│   ├── integrations/
│   └── audit/
├── tsconfig.json           # extends packages/tsconfig
└── package.json
```

Gunakan REST API untuk versi awal. Domain module tetap dipisah agar GraphQL atau komponen event-driven bisa ditambahkan belakangan tanpa merombak struktur.

## 5. Shared Packages

### `packages/database`
- Berisi entity TypeORM, migration, dan seed data.
- Dipakai oleh `apps/api` sebagai satu-satunya sumber schema database.
- Command migration dijalankan dari root: `npm run db:migrate`.

### `packages/shared-types`
- DTO dan interface yang dipakai bersama oleh `apps/web` dan `apps/api` (mis. `TestCase`, `Execution`, `Bug`, `AutomationRun`).
- Menjamin kontrak tipe FE ↔ BE tetap konsisten.

### `packages/api-client`
- Typed HTTP client (axios/fetch wrapper) yang dipakai `apps/web` untuk memanggil `apps/api`.
- Generate ulang tipe dari `shared-types` bila API berubah.

### `packages/eslint-config` & `packages/tsconfig`
- Base config lint dan TypeScript yang di-extend oleh semua app/package agar konsisten.

## 6. Data Layer

PostgreSQL (dikelola lewat `packages/database`) menyimpan:
- Users
- Roles
- Projects
- Requirements
- Scenarios
- Test Cases
- Test Steps
- Executions
- Execution Results
- Automation Tests
- Automation Runs
- Bugs
- Attachments
- Audit Logs

## 7. Automation Architecture (`automation/`)

### Playwright (`automation/playwright`)

Playwright test berjalan independen dari `apps/`.

```
automation/playwright/
└── tests/
    └── auth/
        └── login.spec.ts
```

Reporter/integration layer mengirim:
- Test identifier
- Status
- Duration
- Error
- Screenshot
- Video
- Trace
- Logs

ke QATrack API (`apps/api`).

### Cypress (`automation/cypress`)

Mengikuti model integrasi konseptual yang sama seperti Playwright.

Automation framework harus memetakan automated test ke QATrack Test Case ID.

Contoh:

```
TC-1024 → Playwright test → automation/playwright/tests/auth/login.spec.ts
```

## 8. CI/CD

Alur contoh (memanfaatkan Turborepo remote caching agar step yang tidak berubah tidak di-build ulang):

```
Git push
  → CI pipeline
  → npm ci (install dependencies, root workspace)
  → turbo run build --filter=apps/api --filter=apps/web
  → turbo run test
  → Run Playwright/Cypress (automation/)
  → Collect results
  → Upload evidence (object storage)
  → Send results to QATrack API
  → Update Automation Run
  → Link failed tests to bugs
```

Karena Turborepo, pipeline CI bisa memakai `--filter` agar hanya app yang berubah yang di-build/test ulang.

## 9. Authentication

Gunakan:
- Access token
- Refresh token
- Role-based authorization

Role yang disarankan:
- QA Engineer
- QA Lead
- Developer
- Project Manager
- Admin

## 10. API Design

Endpoint yang disarankan (`apps/api`):

```
GET  /projects
POST /projects

GET  /requirements
POST /requirements

GET  /test-scenarios
POST /test-scenarios

GET  /test-cases
POST /test-cases
GET  /test-cases/:id
PUT  /test-cases/:id

POST /executions
GET  /executions/:id
POST /executions/:id/results

GET  /automation/runs
GET  /automation/runs/:id
POST /automation/results

GET  /bugs
POST /bugs
GET  /bugs/:id
PUT  /bugs/:id

GET  /reports
```

Tipe request/response untuk endpoint di atas didefinisikan di `packages/shared-types` agar `apps/web` dan `apps/api` selalu sinkron.

## 11. Storage

Binary evidence tidak disimpan langsung di PostgreSQL. Untuk menekan biaya (optimasi free tier), storage evidence memakai skema **hybrid: local disk sebagai default, dengan opsi upload ke Google Drive**.

Yang disimpan sebagai evidence:
- Screenshots
- Videos
- Trace files
- Logs
- Attachments

PostgreSQL hanya menyimpan metadata dan referensi (path lokal atau `driveFileId`/URL Google Drive) — bukan binary-nya.

### 11.1 Local Storage (default)

- Evidence dari Playwright/Cypress ditulis ke disk lokal server `apps/api`, mis. `storage/evidence/{runId}/{testId}/...`.
- Cocok untuk development dan self-hosted deployment skala kecil tanpa biaya cloud storage.
- `apps/api` expose static/protected route untuk serve file ini (mis. `GET /evidence/:runId/:fileId`), dengan auth check agar tidak public.
- Retention policy perlu diatur (mis. auto-cleanup evidence run lama) karena disk lokal terbatas.

### 11.2 Google Drive (opsional, upload manual/terjadwal)

- Ditujukan untuk memanfaatkan free tier Google Drive (15GB) sebagai backup/offload evidence, tanpa perlu S3/MinIO berbayar.
- Alur: evidence tersimpan dulu di local storage → job/worker terpisah meng-upload ke folder Google Drive tertentu via **Google Drive API** (service account atau OAuth) → `driveFileId` hasil upload disimpan ke tabel `attachments` sebagai referensi tambahan.
- Bisa dipicu:
  - **Manual**: tombol "Upload to Drive" di UI (per run atau per test case), untuk kontrol penuh kapan kuota Drive dipakai.
  - **Terjadwal**: cron job di `apps/api` yang meng-upload evidence run yang sudah selesai, lalu opsional menghapus copy lokal untuk hemat disk.
- Modul terkait: tambahkan `integrations/google-drive/` di `apps/api` untuk auth, upload, dan resolve link (`webViewLink`/`webContentLink`).
- Tabel `attachments` perlu kolom tambahan: `storage_type` (`local` | `google_drive`), `local_path` (nullable), `drive_file_id` (nullable), `drive_web_link` (nullable).

### 11.3 Kapan upgrade ke object storage generik (S3/MinIO)

Skema ini didesain agar mudah diganti nanti: cukup tambah `storage_type: 's3'` dan implementasi provider baru di layer storage abstraction (`apps/api` sebaiknya punya interface `StorageProvider` dengan implementasi `LocalStorageProvider` dan `GoogleDriveStorageProvider`, agar S3/MinIO tinggal ditambah tanpa ubah domain logic lain).

## 12. Observability

Rencanakan:
- Structured application logs
- API request logging
- Automation run logs
- Audit logs
- Error monitoring
- Health checks (mis. `/health` di `apps/api`, dicek oleh Docker healthcheck)

## 13. Security

- RBAC
- Input validation (class-validator di NestJS)
- API authentication
- Rate limiting
- Secure file upload
- Audit trail
- Environment separation (`.env` per environment, tidak pernah commit)
- Secret management

## 14. Deployment

### Development (local)

```bash
npm install                 # install semua workspace dari root
docker compose up -d db     # jalankan PostgreSQL saja lewat docker
npm run dev                 # turbo run dev → menjalankan apps/web & apps/api paralel
```

### Docker Compose (initial deployment)

```
infrastructure/docker/
├── docker-compose.yml
├── Dockerfile.web
└── Dockerfile.api
```

Service:
- `web` (apps/web, hasil build Vite di-serve statis/Nginx)
- `api` (apps/api, hasil build NestJS)
- `postgres`
- `object-storage` (opsional, mis. MinIO)

### Production

Bisa berkembang ke:
- Kubernetes
- Managed PostgreSQL
- S3-compatible object storage
- CI/CD runner dengan Turborepo remote cache (self-hosted atau Vercel Remote Cache)