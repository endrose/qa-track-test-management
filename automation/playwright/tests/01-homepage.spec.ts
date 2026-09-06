import { test, expect } from '@playwright/test';

/**
 * Test Suite: QA Practice Website - Homepage & Navigation
 * Target: https://www.qa-practice.com/
 */
test.describe('Homepage', () => {
  test('TC-001: Homepage loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home Page | QA Practice/);
  });

  test('TC-002: Homepage displays welcome heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Hello!');
  });

  test('TC-003: Quick start links are visible on homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Text input' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Simple button' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Single checkbox' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Text area' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Select input' })).toBeVisible();
  });
});
