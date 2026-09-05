---
name: QATrack Design System
colors:
  surface: '#12131a'
  surface-dim: '#12131a'
  surface-bright: '#383941'
  surface-container-lowest: '#0d0e15'
  surface-container-low: '#1a1b22'
  surface-container: '#1e1f26'
  surface-container-high: '#292931'
  surface-container-highest: '#33343c'
  on-surface: '#e3e1ec'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e3e1ec'
  inverse-on-surface: '#2f3038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#c8c6c8'
  on-secondary: '#313032'
  secondary-container: '#474649'
  on-secondary-container: '#b7b4b7'
  tertiary: '#c8c6c9'
  on-tertiary: '#303033'
  tertiary-container: '#919094'
  on-tertiary-container: '#29292c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e5e1e4'
  secondary-fixed-dim: '#c8c6c8'
  on-secondary-fixed: '#1c1b1d'
  on-secondary-fixed-variant: '#474649'
  tertiary-fixed: '#e4e1e5'
  tertiary-fixed-dim: '#c8c6c9'
  on-tertiary-fixed: '#1b1b1e'
  on-tertiary-fixed-variant: '#47464a'
  background: '#12131a'
  on-background: '#e3e1ec'
  surface-variant: '#33343c'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-gutter: 24px
  sidebar-width: 260px
  space-xxs: 4px
  space-xs: 8px
  space-sm: 12px
  space-md: 16px
  space-lg: 24px
  space-xl: 32px
  space-xxl: 48px
---

## Brand & Style

This design system establishes a high-performance, precise visual language tailored for complex developer tooling and enterprise QA management. The brand personality is grounded, reliable, and deeply technical—evoking uncompromising accuracy and relentless efficiency. 

We embrace a **Corporate / Modern** design style enriched with developer-centric utilitarianism. The aesthetic prioritizes raw data density, clear status indicators, and zero-friction navigation, ensuring that QA engineers and automation leads can rapidly parse test suites, execution metrics, and failure logs without visual fatigue.

## Colors

The color architecture is built on a high-contrast dark-mode foundation utilizing deep zinc and slate neutrals (`#09090B` backgrounds, `#27272A` borders and surface containers) to keep complex telemetry and dense data grids in sharp focus. 

The primary accent is a vibrant indigo (`#6366F1`), reserved for high-value interactive elements, primary actions, and active states. Semantic status colors are strictly enforced for test outcomes: emerald for passed, rose for failed, amber for blocked, and blue for informational states. Neutral typography scales from pure white (`#FAFAFA`) for primary headers down to muted zinc (`#A1A1AA`) for secondary metadata.

## Typography

Typography pairs clean, geometric headers (**Geist**) with highly readable sans-serif body copy (**Inter**). Monospace typography (**JetBrains Mono**) is heavily utilized for code snippets, test run IDs, timestamps, execution durations, and status badges to maintain alignment across dense tables and logs. 

Ensure that font scaling remains tight; hierarchy is established primarily through font weight and subtle shifts in neutral color rather than extreme size variations.

## Layout & Spacing

The layout model relies on a responsive **Fluid Grid** system optimized for desktop-class developer environments, scaling down to tablet form factors. The interface is structured around a fixed application shell (collapsible sidebar navigation, persistent top telemetry/search bar) enclosing flexible, content-heavy workspaces.

Spacing strictly follows an 8px base rhythm with 4px micro-adjustments for dense component padding. Gutters between cards and grid items are standardized at 24px, while table cells utilize compact vertical padding (8px) to maximize data visibility.

## Elevation & Depth

Visual hierarchy is established primarily through **Low-contrast outlines** ("ghost borders") and precise tonal layering rather than heavy drop shadows. 

Surfaces step up using incremental zinc opacity values: background panels sit at `#09090B`, elevated cards and dropdown menus rest on `#18181B`, and interactive hover states elevate to `#27272A`. Borders are rendered in crisp, thin strokes (`#27272A` or `#3F3F46`) to segment panels cleanly without visual noise.

## Shapes

The shape language employs a subtle **Soft** roundedness (`roundedness: 1`). UI containers, cards, and modal dialogs use a restrained 6px to 8px border radius (`0.375rem` - `0.5rem`). Inputs, buttons, and status badges feature tighter 4px rounding to preserve crisp, professional alignment across dense data grids and code blocks. Pill shapes are strictly reserved for status indicators and categorical tags.

## Components

### Buttons
Primary buttons utilize the solid indigo accent (`#6366F1`) with white text, featuring sharp 4px corners and medium font weights. Secondary actions are rendered with ghost borders and transparent fills, shifting to a solid zinc hover state. Destructive actions (e.g., deleting test runs) utilize the rose semantic color.

### Chips & Badges
Badges are critical for test outcomes. They must use JetBrains Mono typography, uppercase tracking, and combine a subtle 10Opacity background tint with a solid 1-pixel matching semantic border (Emerald for Passed, Rose for Failed, Amber for Blocked, Blue for Info).

### Tables
Data grids must feature sticky headers, high-contrast sorting indicators, and alternating or hover-highlighted rows. Cell padding should be kept compact to support high data density for test suites and execution logs.

### Input Fields & Controls
Inputs feature dark zinc backgrounds (`#121214`), subtle ghost borders, and indigo focus rings. Checkboxes and radio buttons use square geometry with crisp borders, avoiding overly rounded pill styles to maintain enterprise developer appeal.

### Cards & Panels
Cards group related test metrics, build artifacts, or suite parameters. They utilize solid dark backgrounds, thin structural borders, and generous internal padding with clear typographic hierarchy.