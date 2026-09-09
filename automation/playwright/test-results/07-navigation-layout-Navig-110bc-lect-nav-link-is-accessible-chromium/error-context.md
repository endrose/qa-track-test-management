# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 07-navigation-layout.spec.ts >> Navigation & Sidebar >> TC-037: Select nav link is accessible
- Location: tests\07-navigation-layout.spec.ts:24:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://www.qa-practice.com/elements/select", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - list [ref=e8]:
      - listitem [ref=e9]:
        - link " Homepage" [ref=e10] [cursor=pointer]:
          - /url: /
          - generic [ref=e11]: 
          - text: Homepage
      - listitem [ref=e12]:
        - link "  Single UI Elements" [ref=e13] [cursor=pointer]:
          - /url: javascript:;
          - generic [ref=e14]: 
          - generic [ref=e15]: 
          - text: Single UI Elements
        - list [ref=e16]:
          - listitem [ref=e17]:
            - link "Inputs" [ref=e18] [cursor=pointer]:
              - /url: /elements/input
          - listitem [ref=e19]:
            - link "Buttons" [ref=e20] [cursor=pointer]:
              - /url: /elements/button
          - listitem [ref=e21]:
            - link "Checkbox" [ref=e22] [cursor=pointer]:
              - /url: /elements/checkbox
          - listitem [ref=e23]:
            - link "Select" [ref=e24] [cursor=pointer]:
              - /url: /elements/select
          - listitem [ref=e25]:
            - link "New tab" [ref=e26] [cursor=pointer]:
              - /url: /elements/new_tab
          - listitem [ref=e27]:
            - link "Text area" [ref=e28] [cursor=pointer]:
              - /url: /elements/textarea
          - listitem [ref=e29]:
            - link "Alerts" [ref=e30] [cursor=pointer]:
              - /url: /elements/alert
          - listitem [ref=e31]:
            - link "Drag and Drop" [ref=e32] [cursor=pointer]:
              - /url: /elements/dragndrop
          - listitem [ref=e33]:
            - link "Iframes" [ref=e34] [cursor=pointer]:
              - /url: /elements/iframe/iframe_page
          - listitem [ref=e35]:
            - link "Pop-Up" [ref=e36] [cursor=pointer]:
              - /url: /elements/popup
      - listitem [ref=e37]:
        - link "  Forms" [ref=e38] [cursor=pointer]:
          - /url: javascript:;
          - generic [ref=e39]: 
          - generic [ref=e40]: 
          - text: Forms
    - generic [ref=e41]:
      - heading "Select inputs" [level=1] [ref=e42]
      - list [ref=e43]:
        - listitem [ref=e44]:
          - link "Single select" [ref=e45] [cursor=pointer]:
            - /url: /elements/select/single_select
        - listitem [ref=e46]:
          - link "Multiple selects" [ref=e47] [cursor=pointer]:
            - /url: /elements/select/mult_select
      - generic [ref=e48]:
        - generic [ref=e49]:
          - generic [ref=e50]: Choose language*
          - combobox "Choose language*" [ref=e51]:
            - option [selected]
            - option "Python"
            - option "Ruby"
            - option "JavaScript"
            - option "Java"
            - option "C#"
        - button "Submit" [ref=e52] [cursor=pointer]
      - button "Requirements:" [ref=e53] [cursor=pointer]
  - generic [ref=e56]:
    - link "Contact" [ref=e57] [cursor=pointer]:
      - /url: /contact/
    - link "What's new" [ref=e58] [cursor=pointer]:
      - /url: /whats_new/
  - contentinfo [ref=e59]:
    - generic [ref=e60]:
      - text: "© 2026 Copyright:"
      - link "www.qa-practice.com" [ref=e61] [cursor=pointer]:
        - /url: https://www.qa-practice.com/
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * Test Suite: QA Practice Website - Navigation & Sidebar Links
  5  |  * Verifies all main sidebar nav items are reachable
  6  |  */
  7  | test.describe('Navigation & Sidebar', () => {
  8  |   test('TC-034: Inputs nav link is accessible', async ({ page }) => {
  9  |     await page.goto('/');
  10 |     await page.goto('/elements/input');
  11 |     await expect(page).toHaveURL(/\/elements\/input/);
  12 |   });
  13 | 
  14 |   test('TC-035: Buttons nav link is accessible', async ({ page }) => {
  15 |     await page.goto('/elements/button');
  16 |     await expect(page).toHaveURL(/\/elements\/button/);
  17 |   });
  18 | 
  19 |   test('TC-036: Checkbox nav link is accessible', async ({ page }) => {
  20 |     await page.goto('/elements/checkbox');
  21 |     await expect(page).toHaveURL(/\/elements\/checkbox/);
  22 |   });
  23 | 
  24 |   test('TC-037: Select nav link is accessible', async ({ page }) => {
> 25 |     await page.goto('/elements/select');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  26 |     await expect(page).toHaveURL(/\/elements\/select/);
  27 |   });
  28 | 
  29 |   test('TC-038: Textarea nav link is accessible', async ({ page }) => {
  30 |     await page.goto('/elements/textarea');
  31 |     await expect(page).toHaveURL(/\/elements\/textarea/);
  32 |   });
  33 | 
  34 |   test('TC-039: Alerts nav link is accessible', async ({ page }) => {
  35 |     await page.goto('/elements/alert');
  36 |     await expect(page).toHaveURL(/\/elements\/alert/);
  37 |   });
  38 | 
  39 |   test('TC-040: Practice Form nav link is accessible', async ({ page }) => {
  40 |     await page.goto('/forms/practice-form');
  41 |     await expect(page).toHaveURL(/\/forms\/practice-form/);
  42 |   });
  43 | });
  44 | 
  45 | /**
  46 |  * Test Suite: QA Practice Website - Responsiveness & Layout
  47 |  */
  48 | test.describe('Layout & Responsiveness', () => {
  49 |   test('TC-041: Homepage renders on mobile viewport', async ({ page }) => {
  50 |     await page.setViewportSize({ width: 375, height: 812 });
  51 |     await page.goto('/');
  52 |     await expect(page.locator('h1')).toBeVisible();
  53 |   });
  54 | 
  55 |   test('TC-042: Homepage renders on tablet viewport', async ({ page }) => {
  56 |     await page.setViewportSize({ width: 768, height: 1024 });
  57 |     await page.goto('/');
  58 |     await expect(page.locator('h1')).toBeVisible();
  59 |   });
  60 | 
  61 |   test('TC-043: Logo is displayed on homepage', async ({ page }) => {
  62 |     await page.goto('/');
  63 |     const logo = page.locator('img.logo_image');
  64 |     await expect(logo).toBeVisible();
  65 |   });
  66 | 
  67 |   test('TC-044: Footer contains copyright text', async ({ page }) => {
  68 |     await page.goto('/');
  69 |     await expect(page.locator('footer')).toContainText('Copyright');
  70 |   });
  71 | 
  72 |   test('TC-045: Contact link in footer is visible', async ({ page }) => {
  73 |     await page.goto('/');
  74 |     await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  75 |   });
  76 | });
  77 | 
```