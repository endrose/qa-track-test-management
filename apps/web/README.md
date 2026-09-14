# QA Track Web Frontend

The frontend application for QA Track Test Management, built with Vue 3 and Vite.

## 🎨 Design System

This application features a **Neo-Brutalist** design aesthetic characterized by:
- High contrast borders (`border-[2px]` or `border-[3px]`)
- Harsh box shadows (`shadow-[4px_4px_0px_#000000]`)
- Distinct, vibrant colors (Tailwind CSS custom config)
- Distinctive typography (`Outfit` for headlines, `Space Mono` for monospace)
- Interactive hover states (`hover:-translate-y-[2px]`, `hover:shadow-[6px_6px_0px_#000000]`)

## ✨ Key Features

- **Dynamic Dashboards**: Visualize testing metrics.
- **Visual Test Builder**: A drag-and-drop / select interface for creating automation scripts without coding.
- **Smart Element Scanner**: Integrated UI for fetching DOM locators from external URLs.
- **In-Browser IDE**: Monaco-like lightweight script editor with Playwright/Cypress autocomplete and dictionaries.
- **Test Execution Runner**: Trigger runs and view real-time log outputs directly in the UI.

## 🛠 Tech Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **Routing**: Vue Router
- **Styling**: Tailwind CSS v4

## 🚀 Development

Start the development server:

```bash
# Run from the workspace root:
npm run dev --filter web

# Or from this directory:
npm run dev
```

The app will be available at `http://localhost:5173`. It expects the API backend to be running on `http://127.0.0.1:3000`.

## 📁 Directory Structure

- `src/components/` - Reusable UI components (Sidebar, Modals, Forms).
- `src/pages/` - Main route views (Dashboard, TestCases, Projects, Bugs, Reports).
- `src/router/` - Vue Router configuration.
- `src/assets/` - Global CSS and fonts (`index.css`).
