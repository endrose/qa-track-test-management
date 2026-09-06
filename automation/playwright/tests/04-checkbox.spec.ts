import { test, expect } from '@playwright/test';

/**
 * Test Suite: QA Practice Website - Checkbox Elements
 * Target: https://www.qa-practice.com/elements/checkbox/single_checkbox
 */
test.describe('Checkbox Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/elements/checkbox/single_checkbox');
  });

  test('TC-013: Checkbox page loads correctly', async ({ page }) => {
    await expect(page).toHaveURL(/\/elements\/checkbox\/single_checkbox/);
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  });

  test('TC-014: Checkbox is unchecked by default', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).not.toBeChecked();
  });

  test('TC-015: User can check the checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('TC-016: User can uncheck a checked checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('TC-017: Checkbox can be toggled multiple times', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    for (let i = 0; i < 3; i++) {
      await checkbox.click();
    }
    // After 3 clicks (odd), checkbox should be checked
    await expect(checkbox).toBeChecked();
  });
});
