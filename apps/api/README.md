# QA Track API Backend

The backend application for QA Track Test Management, built with NestJS and TypeORM.

## ✨ Key Features

- **RESTful API**: Serves endpoints for Projects, Test Cases, Bugs, Reports, and Users.
- **TypeORM + SQLite**: Lightweight, zero-config local database for easy setup and persistent storage.
- **Automation Engine Integration**: 
  - Uses Node's `child_process` to trigger Playwright and Cypress test suites locally.
  - Generates `.spec.ts` (Playwright) and `.cy.ts` (Cypress) scripts dynamically based on JSON payloads from the frontend Visual Step Builder.
  - Automatically handles Allure Report generation after test runs.
- **Auto-Bug Creation**: Detects failed automation runs and automatically files bug tickets linked to the test case and project.
- **Smart Scanner Proxy**: Acts as a bridge to execute `scanner.mjs` (a Playwright-based headless browser script) to extract DOM locators for external URLs.

## 🛠 Tech Stack

- **Framework**: NestJS
- **ORM**: TypeORM
- **Database**: SQLite (Stored locally in the `packages/database` directory)
- **Language**: TypeScript

## 🚀 Development

Start the development server:

```bash
# Run from the workspace root:
npm run dev --filter api

# Or from this directory:
npm run start:dev
```

The API will be available at `http://127.0.0.1:3000`. 
**Note:** It binds to `127.0.0.1` (IPv4) instead of `localhost` to ensure consistent connectivity with the Vue frontend.

## 📁 Directory Structure

- `src/` - NestJS Modules, Controllers, and Services.
  - `automation/` - Logic for script generation and CLI execution of tests.
  - `test-cases/` - Test case CRUD logic.
  - `projects/`, `bugs/`, `test-reports/` - Core entity management.
