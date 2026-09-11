# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-text-input.spec.ts >> Text Input Element >> TC-006: Submit button triggers result after text entry
- Location: tests\02-text-input.spec.ts:23:7

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
      - heading "Input field" [level=1] [ref=e42]
      - list [ref=e43]:
        - listitem [ref=e44]:
          - link "Text input" [ref=e45] [cursor=pointer]:
            - /url: /elements/input/simple
        - listitem [ref=e46]:
          - link "Email field" [ref=e47] [cursor=pointer]:
            - /url: /elements/input/email
        - listitem [ref=e48]:
          - link "Password field" [ref=e49] [cursor=pointer]:
            - /url: /elements/input/passwd
      - generic [ref=e51]:
        - generic [ref=e52]: Text string*
        - textbox "Text string*" [ref=e53]:
          - /placeholder: Submit me
      - button "Requirements:" [ref=e54] [cursor=pointer]
  - generic [ref=e57]:
    - link "Contact" [ref=e58] [cursor=pointer]:
      - /url: /contact/
    - link "What's new" [ref=e59] [cursor=pointer]:
      - /url: /whats_new/
  - contentinfo [ref=e60]:
    - generic [ref=e61]:
      - text: "© 2026 Copyright:"
      - link "www.qa-practice.com" [ref=e62] [cursor=pointer]:
        - /url: https://www.qa-practice.com/
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * Test Suite: QA Practice Website - Text Input Elements
  5  |  * Target: https://www.qa-practice.com/elements/input/simple
  6  |  */
  7  | test.describe('Text Input Element', () => {
> 8  |   test.beforeEach(async ({ page }) => {
     |        ^ Test timeout of 30000ms exceeded while running "beforeEach" hook.
  9  |     await page.goto('/elements/input/simple');
  10 |   });
  11 | 
  12 |   test('TC-004: Text input page loads correctly', async ({ page }) => {
  13 |     await expect(page).toHaveURL(/\/elements\/input\/simple/);
  14 |     await expect(page.locator('input[type="text"]')).toBeVisible();
  15 |   });
  16 | 
  17 |   test('TC-005: User can type text into the input field', async ({ page }) => {
  18 |     const input = page.locator('input[type="text"]');
  19 |     await input.fill('Hello QA World!');
  20 |     await expect(input).toHaveValue('Hello QA World!');
  21 |   });
  22 | 
  23 |   test('TC-006: Submit button triggers result after text entry', async ({ page }) => {
  24 |     const input = page.locator('input[type="text"]');
  25 |     await input.fill('test automation');
  26 |     // Try multiple possible submit button selectors
  27 |     const submitBtn = page.locator('button[type="submit"], input[type="submit"], button.btn, a.btn').first();
  28 |     if (await submitBtn.isVisible()) {
  29 |       await submitBtn.click();
  30 |       await page.waitForTimeout(1000);
  31 |     }
  32 |     // Page should remain in the elements/input domain
  33 |     await expect(page).toHaveURL(/\/elements/);
  34 |   });
  35 | 
  36 |   test('TC-007: Input field clears correctly', async ({ page }) => {
  37 |     const input = page.locator('input[type="text"]');
  38 |     await input.fill('some text');
  39 |     await input.clear();
  40 |     await expect(input).toHaveValue('');
  41 |   });
  42 | 
  43 |   test('TC-008: Input accepts special characters', async ({ page }) => {
  44 |     const input = page.locator('input[type="text"]');
  45 |     await input.fill('Test@#$%!123');
  46 |     await expect(input).toHaveValue('Test@#$%!123');
  47 |   });
  48 | });
  49 | 
```