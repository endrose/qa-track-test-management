# QA Track - Web Frontend

The main user interface for the QA Track Test Management system.

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Tailwind CSS v4
- **State Management**: Pinia
- **Routing**: Vue Router

## Getting Started

From this directory, you can start the local development server:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## ✨ Features

- 🎨 **Neo-brutalist Design**: Unique, bold UI using high-contrast borders and vibrant colors
- 📊 **Dynamic Dashboard**: Live analytics fetching from PostgreSQL backend
- 🤖 **Automation Interface**: Trigger local Cypress & Playwright tests directly from UI and view JSON results
- 👥 **Role-Based Access Control (RBAC)**: Custom menu and permissions based on user role (Admin, QA Lead, Tester, Developer, Viewer).
- 📈 **Advanced Reporting**: Generate testing snapshots and view history.
- 📱 **Responsive Layout**: Works seamlessly on desktop and tablet devices

## Architecture

This frontend is configured to consume the backend API and utilizes a modern Neobrutalism design system configured via Tailwind CSS. Components are built using the Vue 3 `<script setup>` syntax for better performance and developer experience.
