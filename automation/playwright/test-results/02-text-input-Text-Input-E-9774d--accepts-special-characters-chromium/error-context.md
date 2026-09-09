# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-text-input.spec.ts >> Text Input Element >> TC-008: Input accepts special characters
- Location: tests\02-text-input.spec.ts:43:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://www.qa-practice.com/elements/input/simple", waiting until "load"

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
  8  |   test.beforeEach(async ({ page }) => {
> 9  |     await page.goto('/elements/input/simple');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
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