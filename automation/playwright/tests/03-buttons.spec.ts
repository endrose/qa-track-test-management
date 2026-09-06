import { test, expect } from '@playwright/test';

/**
 * Test Suite: QA Practice Website - Button Elements
 * Target: https://www.qa-practice.com/elements/button/simple
 */
test.describe('Button Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/elements/button/simple');
  });

  test('TC-009: Button page loads and button is visible', async ({ page }) => {
    await expect(page).toHaveURL(/\/elements\/button\/simple/);
    const button = page.locator('button, input[type="button"], input[type="submit"]').first();
    await expect(button).toBeVisible();
  });

  test('TC-010: Button is clickable and responds', async ({ page }) => {
    const button = page.locator('button, input[type="button"], input[type="submit"]').first();
    await button.click();
    await page.waitForTimeout(500);
    // After click, page might show a result/response
    await expect(page).toHaveURL(/\/elements\/button/);
  });

  test('TC-011: Button is enabled by default', async ({ page }) => {
    const button = page.locator('button, input[type="button"], input[type="submit"]').first();
    await expect(button).toBeEnabled();
  });

  test('TC-012: Button hover state is accessible', async ({ page }) => {
    const button = page.locator('button, input[type="button"], input[type="submit"]').first();
    await button.hover();
    // Button should still be visible after hover
    await expect(button).toBeVisible();
  });
});
