# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03-buttons.spec.ts >> Button Elements >> TC-011: Button is enabled by default
- Location: tests\03-buttons.spec.ts:26:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://www.qa-practice.com/elements/button/simple", waiting until "load"

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
      - heading "Buttons" [level=1] [ref=e42]
      - list [ref=e43]:
        - listitem [ref=e44]:
          - link "Simple button" [ref=e45] [cursor=pointer]:
            - /url: /elements/button/simple
        - listitem [ref=e46]:
          - link "Looks like a button" [ref=e47] [cursor=pointer]:
            - /url: /elements/button/like_a_button
        - listitem [ref=e48]:
          - link "Disabled" [ref=e49] [cursor=pointer]:
            - /url: /elements/button/disabled
      - button "Click" [ref=e51] [cursor=pointer]
      - button "Requirements:" [ref=e52] [cursor=pointer]
  - generic [ref=e55]:
    - link "Contact" [ref=e56] [cursor=pointer]:
      - /url: /contact/
    - link "What's new" [ref=e57] [cursor=pointer]:
      - /url: /whats_new/
  - contentinfo [ref=e58]:
    - generic [ref=e59]:
      - text: "© 2026 Copyright:"
      - link "www.qa-practice.com" [ref=e60] [cursor=pointer]:
        - /url: https://www.qa-practice.com/
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * Test Suite: QA Practice Website - Button Elements
  5  |  * Target: https://www.qa-practice.com/elements/button/simple
  6  |  */
  7  | test.describe('Button Elements', () => {
  8  |   test.beforeEach(async ({ page }) => {
> 9  |     await page.goto('/elements/button/simple');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  10 |   });
  11 | 
  12 |   test('TC-009: Button page loads and button is visible', async ({ page }) => {
  13 |     await expect(page).toHaveURL(/\/elements\/button\/simple/);
  14 |     const button = page.locator('button, input[type="button"], input[type="submit"]').first();
  15 |     await expect(button).toBeVisible();
  16 |   });
  17 | 
  18 |   test('TC-010: Button is clickable and responds', async ({ page }) => {
  19 |     const button = page.locator('button, input[type="button"], input[type="submit"]').first();
  20 |     await button.click();
  21 |     await page.waitForTimeout(500);
  22 |     // After click, page might show a result/response
  23 |     await expect(page).toHaveURL(/\/elements\/button/);
  24 |   });
  25 | 
  26 |   test('TC-011: Button is enabled by default', async ({ page }) => {
  27 |     const button = page.locator('button, input[type="button"], input[type="submit"]').first();
  28 |     await expect(button).toBeEnabled();
  29 |   });
  30 | 
  31 |   test('TC-012: Button hover state is accessible', async ({ page }) => {
  32 |     const button = page.locator('button, input[type="button"], input[type="submit"]').first();
  33 |     await button.hover();
  34 |     // Button should still be visible after hover
  35 |     await expect(button).toBeVisible();
  36 |   });
  37 | });
  38 | 
```