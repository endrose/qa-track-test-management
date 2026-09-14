# QA Track Test Management

QA Track is a comprehensive, modern test management platform built with a monorepo architecture. It is designed to bridge the gap between manual testing and automated testing through intelligent code generation and powerful local execution.

## 🌟 Key Features

- **Project & Test Case Management**: Organize projects, create rich test cases, and track their status from Draft to Automated.
- **Visual Step Builder (No-Code)**: Create test scripts using a visual step builder without writing code.
- **Smart UI Scanner**: Automatically scan any URL to extract locators (CSS, ID, XPath, Text) using an integrated Playwright scanner.
- **Playwright & Cypress Generation**: Automatically convert visual steps into Playwright (`.spec.ts`) or Cypress (`.cy.ts`) scripts.
- **Built-in Script Editor**: Edit automation scripts directly in the browser with syntax autocomplete and integrated dictionaries for Playwright and Cypress.
- **Local Test Execution**: Execute Playwright and Cypress tests directly from the dashboard and monitor real-time outputs.
- **Allure Reporting**: Automatically generate and serve rich Allure Test Reports after test executions.
- **Bug Tracking**: Built-in bug tracker with auto-bug creation on test failures.

## 🛠 Tech Stack

### Frontend (apps/web)
- **Vue 3** (Composition API) & **Vite**
- **Tailwind CSS** (Custom Neo-Brutalist & Premium Design System)
- **Vue Router**

### Backend (apps/api)
- **NestJS** (Node.js framework)
- **TypeORM** with **SQLite** (Zero-config local database)
- **Node child_process** for executing Playwright/Cypress CLI commands

### Automation Core (automation/)
- **Playwright** & **Cypress** test runners.
- **Allure Commandline** for reporting.

### Infrastructure
- **Turborepo** (Monorepo management)
- **npm Workspaces**

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- Java (Required for Allure Report generation)

### Installation

```bash
# 1. Install workspace dependencies
npm install

# 2. Start the dev servers (using Turbo)
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://127.0.0.1:3000`.

## 📁 Workspace Structure

- `apps/web/` - The Vue 3 frontend application.
- `apps/api/` - The NestJS backend application.
- `automation/playwright/` - Playwright workspace containing scripts, tests, and scanner utilities.
- `automation/cypress/` - Cypress workspace for E2E tests.
- `packages/database/` - Shared TypeORM entities and SQLite config.

## 💡 Useful Scripts

- `npm run build` - Build all applications and packages.
- `npm run dev` - Start development servers.
- `npm run clean` - Remove node_modules and dist folders across the monorepo.
