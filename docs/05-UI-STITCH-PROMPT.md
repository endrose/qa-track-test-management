# QATrack — Google Stitch Prompt

Design a complete desktop-first web application UI called QATrack, a professional QA Test Management and Test Automation Platform.

Use **Neo-Brutalism as the primary visual style**, combined with modern enterprise SaaS and developer tooling.

The application is for QA Engineers, QA Leads, Developers, and Project Managers.

Core workflow:

Requirement → Test Scenario → Test Case → Test Execution → Automation → Bug → Retest → Report → Release Quality.

## Visual Style

Use:
- Thick black borders
- Hard offset shadows
- Flat colors
- High contrast
- Bold typography
- Rectangular geometry
- Minimal gradients
- Minimal blur
- Strong component boundaries
- Tactile buttons

Avoid:
- Glassmorphism
- Soft floating cards
- Excessive border radius
- Excessive gradients
- Generic admin dashboard appearance
- Excessive decorative illustrations

Neo-Brutalism must remain professional, technical, enterprise-ready, and suitable for a real QA team.

Base colors:
- White
- Off-white
- Near-black

Selective accents:
- Electric yellow
- Bright blue
- Lime
- Coral/red
- Purple

Use semantic colors for status without relying on color alone.

Use hard shadows such as 5px 5px 0 black.

Use 0–6px border radius.

## Desktop

Optimize for:
- 1280px
- 1440px
- 1920px

Use a persistent sidebar approximately 250px wide and a top navigation bar.

Sidebar sections:

WORKSPACE
- Dashboard
- Projects

TESTING
- Requirements
- Test Scenarios
- Test Cases
- Test Executions
- Automation

QUALITY
- Bugs
- Reports
- RTM

ADMINISTRATION
- Settings

Top bar:
- Project selector
- Environment selector
- Global search
- Notifications
- User profile

## Screens

Design these major screens:

1. Dashboard
2. Projects
3. Requirements
4. Test Scenarios
5. Test Cases
6. Test Case Detail
7. Test Executions
8. Manual Test Execution
9. Automation
10. Automation Run Detail
11. Bugs
12. Bug Detail
13. Reports
14. Requirement Traceability Matrix
15. Settings

## Dashboard

Show:
- Total Test Cases
- Pass Rate
- Automation Coverage
- Open Bugs
- Critical Bugs
- Blocked Tests
- Test execution chart
- Requirement coverage
- Automation status
- Recent test runs
- Recent bugs

Use bold rectangular KPI blocks and strong bordered analytical panels.

## Test Cases

Create an information-dense engineering table.

Columns:
Checkbox, ID, Title, Scenario, Requirement, Type, Priority, Automation, Last Result, Status, Updated.

Toolbar:
Search, Type, Priority, Status, Automation, Requirement, Scenario.

Actions:
Create Test Case, Import, Export.

Support sorting, filtering, pagination, bulk actions, and column visibility.

## Test Case Detail

Header:
TC-1024 — Login with valid credentials

Actions:
Edit, Execute, Automate, Duplicate.

Tabs:
Overview, Steps, Executions, Automation, Bugs, History.

Test step table:
#, Action, Test Data, Expected Result.

## Manual Test Execution

Use a two-panel workspace.

Left panel:
Regression Suite with test cases and statuses.

Right panel:
Selected test case, environment, browser, build, test steps.

Each step can be:
Passed, Failed, Blocked, Skipped.

Actions:
Previous, Save, Next, Finish Execution.

When a test fails, provide Create Bug.

## Automation

Support Playwright and Cypress.

Show:
- Total automated tests
- Passed
- Failed
- Flaky
- Skipped
- Automation Coverage

Recent run table:
Run ID, Framework, Branch, Commit, Environment, Total, Passed, Failed, Duration, Status.

## Automation Run Detail

Show:
- Framework
- Environment
- Browser
- Branch
- Commit
- Duration
- Summary

For failed tests provide:
- Error
- Screenshot
- Video
- Trace
- Console Logs
- Network Logs

Use monospace typography for errors and logs.

## Bugs

Create a professional issue management page.

Columns:
Bug ID, Title, Severity, Priority, Status, Test Case, Environment, Assignee, Created.

Bug detail:
Description, Steps to Reproduce, Expected Result, Actual Result, Environment, Evidence, Related Testing, Activity.

Workflow:
Open → Assigned → In Progress → Resolved → Retest → Closed

Failed retest:
Retest → Reopened

## Reports

Create:
- Test execution analytics
- Defect analytics
- Automation coverage
- Release readiness

Provide Export PDF and Export Excel.

## RTM

Create a requirement traceability matrix:

Requirement | Scenario | Test Cases | Execution | Result | Bugs

Make relationships clickable and visually clear.

## Design System

Use consistent:
- Sidebar
- Top bar
- Buttons
- Inputs
- Tables
- Status badges
- Cards
- Tabs
- Modals
- Drawers
- Toasts
- Empty states
- Loading states
- Error states

## UX

Prioritize:
- Clarity
- Productivity
- Information density
- Fast QA workflows
- Consistency
- Accessibility

Avoid excessive whitespace.

Tables should efficiently use desktop width.

The application must feel like a serious engineering control center, not a generic dashboard.

Use realistic QA data such as:

Project: E-Commerce Platform

Requirements:
REQ-001 User Authentication
REQ-002 Product Search
REQ-003 Shopping Cart
REQ-004 Checkout

Scenarios:
TS-001 Login
TS-002 Registration
TS-003 Search Product
TS-004 Add Product to Cart
TS-005 Checkout

Test Cases:
TC-1024 Login with valid credentials
TC-1025 Login with invalid password
TC-1026 Login with empty username

Bugs:
BUG-1024 Login button returns 500
BUG-1025 Search result pagination broken

Automation:
AUTO-1024 Login valid credentials

Framework:
Playwright

Environment:
QA

Browser:
Chrome

Final visual goal:

A professional QA engineering control center redesigned using modern Neo-Brutalism.

Think:
Linear + GitHub + Jira + modern developer tooling

combined with:

Neo-Brutalist visual identity.

The UI should communicate:
"This is where a serious QA team manages testing, automation, bugs, and release quality."

Design the application as implementation-friendly for Vue 3 + TypeScript + Pinia + NestJS + PostgreSQL + Playwright + Cypress + GitHub Actions.
