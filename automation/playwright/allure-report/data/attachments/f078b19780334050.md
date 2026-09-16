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

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://www.qa-practice.com/elements/checkbox/single_checkbox", waiting until "load"

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
  8  |   test.beforeEach(async ({ page }) => {
> 9  |     await page.goto('/elements/checkbox/single_checkbox');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
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