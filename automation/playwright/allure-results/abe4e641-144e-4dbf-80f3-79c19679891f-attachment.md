# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03-buttons.spec.ts >> Button Elements >> TC-010: Button is clickable and responds
- Location: tests\03-buttons.spec.ts:18:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://www.qa-practice.com/elements/button/simple", waiting until "load"

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