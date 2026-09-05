# QATrack — UI/UX Specification

## Design Direction

QATrack uses:

**Neo-Brutalism + Enterprise SaaS + Developer Tooling + QA Engineering**

The interface must be professional, technical, bold, structured, information-dense, and highly usable.

Avoid:
- Glassmorphism
- Excessive gradients
- Soft floating cards
- Excessive rounded corners
- Generic admin dashboard styling
- Excessive decorative illustrations

Use:
- Thick black borders
- Hard offset shadows
- Flat colors
- High contrast
- Bold typography
- Rectangular geometry
- Strong visual hierarchy
- Tactile interactions

## Color

Base:
- White
- Off-white
- Near-black

Accent options:
- Electric yellow
- Bright blue
- Lime green
- Coral/red
- Purple

Use accents selectively.

Status:
- Passed = success
- Failed = danger
- Blocked = warning
- Skipped = neutral
- Critical = danger
- High = warning
- Medium = informational
- Low = neutral

## Borders

Normal components: 2–3px black border.  
Major containers: 3–4px black border.

## Shadows

Use hard offset shadows, e.g. 5px 5px 0 black. Avoid blurred shadows.

## Radius

Prefer 0–6px. Avoid large rounded cards.

## Desktop

Primary target:
- 1280px
- 1440px
- 1920px

Sidebar:
- 250px expanded
- ~68px collapsed

## Application Shell

Top bar + persistent sidebar + main content.

Navigation:
- Dashboard
- Projects
- Requirements
- Test Scenarios
- Test Cases
- Test Executions
- Automation
- Bugs
- Reports
- RTM
- Settings

## Dashboard

Include:
- Total Test Cases
- Pass Rate
- Automation Coverage
- Open Bugs
- Critical Bugs
- Blocked
- Test Execution chart
- Requirement coverage
- Automation status
- Recent test runs
- Recent bugs

## Test Cases

Provide:
- Search
- Filters
- Sorting
- Pagination
- Bulk actions
- Import/export

Columns:
ID, Title, Scenario, Requirement, Type, Priority, Automation, Last Result, Status, Updated.

## Test Case Detail

Tabs:
- Overview
- Steps
- Executions
- Automation
- Bugs
- History

Test steps table:
#, Action, Test Data, Expected Result.

## Manual Execution

Two-panel desktop workspace.

Left:
Test suite tree and statuses.

Right:
Selected test case and steps.

Step statuses:
- Passed
- Failed
- Blocked
- Skipped

Actions:
Previous, Save, Next, Finish Execution.

## Automation

Support:
- Playwright
- Cypress

Display:
- Total automated tests
- Passed
- Failed
- Flaky
- Skipped
- Coverage
- Recent runs

Automation run detail:
- Error
- Screenshot
- Video
- Trace
- Logs

## Bugs

Use Jira-like issue management.

Statuses:
Open, Assigned, In Progress, Resolved, Retest, Closed, Reopened, Rejected.

Bug detail:
- Description
- Reproduction steps
- Expected
- Actual
- Environment
- Evidence
- Related Requirement
- Scenario
- Test Case
- Execution
- Automation Run
- Activity

## Reports

Include:
- Test execution
- Defect analysis
- Automation coverage
- Release readiness

Export:
- PDF
- Excel

## RTM

Requirement → Scenario → Test Case → Execution → Result → Bug.

## Components

Create a reusable design system:
- Sidebar
- Top bar
- Breadcrumb
- Buttons
- Inputs
- Select
- Filters
- Tabs
- Tables
- Cards
- Badges
- Progress
- Charts
- Modals
- Drawers
- Toasts
- Empty states
- Loading skeletons
- Error states

## Interaction

Buttons should have tactile Neo-Brutalist interactions:
- Hover: slight movement
- Active: translate toward shadow
- Hard shadow reduced on press

## Accessibility

- Strong contrast
- Keyboard navigation
- Visible focus
- Semantic labels
- Accessible tables
- Do not rely only on color
- Clear validation

Keyboard shortcuts:
Ctrl+K = Search
C = Create Test Case
B = Create Bug
R = Run Test

## Responsive

Desktop first.

At ~1024–1280px:
- Collapse sidebar
- Allow table scrolling
- Collapse secondary filters

Tablet:
- Stack layouts
- Use drawers for detail panels

Do not simply shrink desktop components.
