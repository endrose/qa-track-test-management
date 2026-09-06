# QA Track - API Backend

The backend REST API for the QA Track Test Management system.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database ORM**: TypeORM
- **Database**: PostgreSQL
- **Testing**: Vitest & Supertest

## ✨ Features

- 🔒 **Authentication**: Local authentication with default users, and dynamic team member invitations via the API.
- 🗄️ **Database Integration**: TypeORM connected to PostgreSQL with entities for Users, AutomationRuns, TestExecutions, and TestReports.
- 🤖 **Automation Service**: Endpoints to trigger local child processes (Cypress/Playwright) and parse JSON output.
- 📈 **Reporting & Metrics**: Data aggregation for dashboard widgets and report snapshots.

## Getting Started

From this directory, you can run the API locally:

```bash
# Start in development mode
npm run start:dev

# Start in watch mode with debugging
npm run start:debug

# Build the application
npm run build
```

## Available Scripts

- `npm run lint` - Lint the codebase using Oxlint.
- `npm run test` - Run unit tests with Vitest.
- `npm run test:e2e` - Run end-to-end tests.
- `npm run format` - Format code with Prettier.

> Note: Make sure your PostgreSQL database is running and configured correctly in your environment variables before starting the server.
