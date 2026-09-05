# QA Track - API Backend

The backend REST API for the QA Track Test Management system.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database ORM**: TypeORM
- **Database**: PostgreSQL
- **Testing**: Vitest & Supertest

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
