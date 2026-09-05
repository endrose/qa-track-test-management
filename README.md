# QA Track Test Management

QA Track is a comprehensive test management platform built with a modern monorepo architecture.

## Overview

This workspace is managed by [Turborepo](https://turbo.build/) and contains multiple applications and shared packages to support the QA Track platform.

### Applications

- **`apps/web`**: The main user interface built with Vue 3, Vite, and Tailwind CSS v4.
- **`apps/api`**: The backend RESTful API built with NestJS, TypeORM, and PostgreSQL.

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
