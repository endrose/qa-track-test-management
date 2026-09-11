import { test, expect } from '@playwright/test';

test.describe('Website Sauce', () => {
  test('Login Sauce', async ({ page }) => {
    // Navigate to Sauce Demo
    await page.goto('https://www.saucedemo.com/');
    
    // Fill in the credentials
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // Click the login button
    await page.locator('[data-test="login-button"]').click();
    
    // Verify login is successful by checking the inventory page
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Verify a product is visible
    const inventoryList = page.locator('.inventory_list');
    await expect(inventoryList).toBeVisible();
  });
});
