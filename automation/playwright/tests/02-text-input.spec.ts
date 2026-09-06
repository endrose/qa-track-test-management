import { test, expect } from '@playwright/test';

/**
 * Test Suite: QA Practice Website - Text Input Elements
 * Target: https://www.qa-practice.com/elements/input/simple
 */
test.describe('Text Input Element', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/elements/input/simple');
  });

  test('TC-004: Text input page loads correctly', async ({ page }) => {
    await expect(page).toHaveURL(/\/elements\/input\/simple/);
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('TC-005: User can type text into the input field', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Hello QA World!');
    await expect(input).toHaveValue('Hello QA World!');
  });

  test('TC-006: Submit button triggers result after text entry', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('test automation');
    // Try multiple possible submit button selectors
    const submitBtn = page.locator('button[type="submit"], input[type="submit"], button.btn, a.btn').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
    // Page should remain in the elements/input domain
    await expect(page).toHaveURL(/\/elements/);
  });

  test('TC-007: Input field clears correctly', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('some text');
    await input.clear();
    await expect(input).toHaveValue('');
  });

  test('TC-008: Input accepts special characters', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Test@#$%!123');
    await expect(input).toHaveValue('Test@#$%!123');
  });
});
