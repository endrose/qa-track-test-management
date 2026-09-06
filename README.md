# QA Track Test Management

QA Track is a comprehensive test management platform built with a modern monorepo architecture.

## Overview

This workspace is managed by [Turborepo](https://turbo.build/) and contains multiple applications and shared packages to support the QA Track platform.

## 🌟 Features

- **Project Management**: Create and manage multiple testing projects
- **Test Case Management**: Write, organize, and track test cases and scenarios
- **Test Execution**: Record manual test runs and track results
- **Automation Integration**: Run and import results from Cypress and Playwright tests locally via `child_process`.
- **Bug Tracking**: Built-in simple bug tracking linked to test cases
- **Requirements Traceability**: Link tests to requirements with the RTM matrix
- **Analytics & Reports**: Visual dashboard for test metrics, pass rates, and report snapshot generation.
- **Role-Based Access Control (RBAC)**: Distinct permissions and views for Admin, QA Lead, Tester, Developer, and Viewer.

## 🛠 Tech Stack

### Frontend (apps/web)
- **Vue 3** (Composition API)
- **Vite** (Build tool)
- **Tailwind CSS v4** (Styling, Neo-brutalist design)
- **Vue Router** (Navigation)

### Backend (apps/api)
- **NestJS** (Node.js framework)
- **TypeORM** (Database ORM)
- **PostgreSQL** (Primary Database)
- **Node child_process** (For executing local automation tests)

### Infrastructure
- **Turborepo** (Monorepo management)
- **npm Workspaces**

### Development

To start the development environment for all apps simultaneously from the root directory:

```bash
# Install dependencies
npm install

# Start the dev servers (using Turbo)
npm run dev
```

### Useful Scripts

- `npm run build` - Build all applications and packages.
- `npm run lint` - Lint the workspace.
- `npm run test` - Run tests across the workspace.
- `npm run db:migrate` - Run database migrations via the `database` package.
