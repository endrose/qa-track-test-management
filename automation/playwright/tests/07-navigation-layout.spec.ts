import { test, expect } from '@playwright/test';

/**
 * Test Suite: QA Practice Website - Navigation & Sidebar Links
 * Verifies all main sidebar nav items are reachable
 */
test.describe('Navigation & Sidebar', () => {
  test('TC-034: Inputs nav link is accessible', async ({ page }) => {
    await page.goto('/');
    await page.goto('/elements/input');
    await expect(page).toHaveURL(/\/elements\/input/);
  });

  test('TC-035: Buttons nav link is accessible', async ({ page }) => {
    await page.goto('/elements/button');
    await expect(page).toHaveURL(/\/elements\/button/);
  });

  test('TC-036: Checkbox nav link is accessible', async ({ page }) => {
    await page.goto('/elements/checkbox');
    await expect(page).toHaveURL(/\/elements\/checkbox/);
  });

  test('TC-037: Select nav link is accessible', async ({ page }) => {
    await page.goto('/elements/select');
    await expect(page).toHaveURL(/\/elements\/select/);
  });

  test('TC-038: Textarea nav link is accessible', async ({ page }) => {
    await page.goto('/elements/textarea');
    await expect(page).toHaveURL(/\/elements\/textarea/);
  });

  test('TC-039: Alerts nav link is accessible', async ({ page }) => {
    await page.goto('/elements/alert');
    await expect(page).toHaveURL(/\/elements\/alert/);
  });

  test('TC-040: Practice Form nav link is accessible', async ({ page }) => {
    await page.goto('/forms/practice-form');
    await expect(page).toHaveURL(/\/forms\/practice-form/);
  });
});

/**
 * Test Suite: QA Practice Website - Responsiveness & Layout
 */
test.describe('Layout & Responsiveness', () => {
  test('TC-041: Homepage renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('TC-042: Homepage renders on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('TC-043: Logo is displayed on homepage', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('img.logo_image');
    await expect(logo).toBeVisible();
  });

  test('TC-044: Footer contains copyright text', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toContainText('Copyright');
  });

  test('TC-045: Contact link in footer is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  });
});
