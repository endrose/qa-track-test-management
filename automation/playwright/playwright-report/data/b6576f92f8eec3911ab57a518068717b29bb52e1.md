# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04-checkbox.spec.ts >> Checkbox Elements >> TC-014: Checkbox is unchecked by default
- Location: tests\04-checkbox.spec.ts:17:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
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
      - heading "Checkboxes" [level=1] [ref=e42]
      - list [ref=e43]:
        - listitem [ref=e44]:
          - link "Single checkbox" [ref=e45] [cursor=pointer]:
            - /url: /elements/checkbox/single_checkbox
        - listitem [ref=e46]:
          - link "Checkboxes" [ref=e47] [cursor=pointer]:
            - /url: /elements/checkbox/mult_checkbox
      - generic [ref=e48]:
        - generic [ref=e49]:
          - generic [ref=e50]: Checkbox
          - generic [ref=e52]:
            - checkbox "Select me or not" [ref=e53]
            - generic [ref=e54]: Select me or not
        - button "Submit" [ref=e55] [cursor=pointer]
      - button "Requirements:" [ref=e56] [cursor=pointer]
  - generic [ref=e59]:
    - link "Contact" [ref=e60] [cursor=pointer]:
      - /url: /contact/
    - link "What's new" [ref=e61] [cursor=pointer]:
      - /url: /whats_new/
  - contentinfo [ref=e62]:
    - generic [ref=e63]:
      - text: "© 2026 Copyright:"
      - link "www.qa-practice.com" [ref=e64] [cursor=pointer]:
        - /url: https://www.qa-practice.com/
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * Test Suite: QA Practice Website - Checkbox Elements
  5  |  * Target: https://www.qa-practice.com/elements/checkbox/single_checkbox
  6  |  */
  7  | test.describe('Checkbox Elements', () => {
> 8  |   test.beforeEach(async ({ page }) => {
     |        ^ Test timeout of 30000ms exceeded while running "beforeEach" hook.
  9  |     await page.goto('/elements/checkbox/single_checkbox');
  10 |   });
  11 | 
  12 |   test('TC-013: Checkbox page loads correctly', async ({ page }) => {
  13 |     await expect(page).toHaveURL(/\/elements\/checkbox\/single_checkbox/);
  14 |     await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  15 |   });
  16 | 
  17 |   test('TC-014: Checkbox is unchecked by default', async ({ page }) => {
  18 |     const checkbox = page.locator('input[type="checkbox"]').first();
  19 |     await expect(checkbox).not.toBeChecked();
  20 |   });
  21 | 
  22 |   test('TC-015: User can check the checkbox', async ({ page }) => {
  23 |     const checkbox = page.locator('input[type="checkbox"]').first();
  24 |     await checkbox.check();
  25 |     await expect(checkbox).toBeChecked();
  26 |   });
  27 | 
  28 |   test('TC-016: User can uncheck a checked checkbox', async ({ page }) => {
  29 |     const checkbox = page.locator('input[type="checkbox"]').first();
  30 |     await checkbox.check();
  31 |     await checkbox.uncheck();
  32 |     await expect(checkbox).not.toBeChecked();
  33 |   });
  34 | 
  35 |   test('TC-017: Checkbox can be toggled multiple times', async ({ page }) => {
  36 |     const checkbox = page.locator('input[type="checkbox"]').first();
  37 |     for (let i = 0; i < 3; i++) {
  38 |       await checkbox.click();
  39 |     }
  40 |     // After 3 clicks (odd), checkbox should be checked
  41 |     await expect(checkbox).toBeChecked();
  42 |   });
  43 | });
  44 | 
```