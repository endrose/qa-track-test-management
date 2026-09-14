import { test, expect } from '@playwright/test';

test.describe("Test Suite", () => {
  test("Cypress Sauce", async ({ page }) => {
    // Navigate to URL
    await page.goto("https://www.saucedemo.com/");

    // Fill "#user-name" with value
    await page.locator("#user-name").fill("standard_user");

    // Fill "#password" with value
    await page.locator("#password").fill("secret_sauce");

    // Click element
    await page.locator("#login-button").click();

    // Assert text is visible on page
    await expect(page.getByText("Swag Labs")).toBeVisible();

  });
});