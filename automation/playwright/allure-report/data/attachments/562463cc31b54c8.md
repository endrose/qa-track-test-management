# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-homepage.spec.ts >> Homepage >> TC-003: Quick start links are visible on homepage
- Location: tests\01-homepage.spec.ts:18:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://www.qa-practice.com/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * Test Suite: QA Practice Website - Homepage & Navigation
  5  |  * Target: https://www.qa-practice.com/
  6  |  */
  7  | test.describe('Homepage', () => {
  8  |   test('TC-001: Homepage loads and has correct title', async ({ page }) => {
  9  |     await page.goto('/');
  10 |     await expect(page).toHaveTitle(/Home Page | QA Practice/);
  11 |   });
  12 | 
  13 |   test('TC-002: Homepage displays welcome heading', async ({ page }) => {
  14 |     await page.goto('/');
  15 |     await expect(page.locator('h1')).toContainText('Hello!');
  16 |   });
  17 | 
  18 |   test('TC-003: Quick start links are visible on homepage', async ({ page }) => {
> 19 |     await page.goto('/');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  20 |     await expect(page.getByRole('link', { name: 'Text input' })).toBeVisible();
  21 |     await expect(page.getByRole('link', { name: 'Simple button' })).toBeVisible();
  22 |     await expect(page.getByRole('link', { name: 'Single checkbox' })).toBeVisible();
  23 |     await expect(page.getByRole('link', { name: 'Text area' })).toBeVisible();
  24 |     await expect(page.getByRole('link', { name: 'Select input' })).toBeVisible();
  25 |   });
  26 | });
  27 | 
```