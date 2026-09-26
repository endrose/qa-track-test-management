# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cypress-sauce.spec.ts >> Test Suite >> Cypress Sauce
- Location: tests\cypress-sauce.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://www.saucedemo.com/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe("Test Suite", () => {
  4  |   test("Cypress Sauce", async ({ page }) => {
  5  |     // Navigate to URL
> 6  |     await page.goto("https://www.saucedemo.com/");
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  7  | 
  8  |     // Fill "#user-name" with value
  9  |     await page.locator("#user-name").fill("standard_user");
  10 | 
  11 |     // Fill "#password" with value
  12 |     await page.locator("#password").fill("secret_sauce");
  13 | 
  14 |     // Click element
  15 |     await page.locator("#login-button").click();
  16 | 
  17 |     // Assert text is visible on page
  18 |     await expect(page.getByText("Swag Labs")).toBeVisible();
  19 | 
  20 |   });
  21 | });
```