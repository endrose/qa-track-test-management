import { test, expect } from '@playwright/test';

test.describe("Test Suite", () => {
  test("Website Sauce", async ({ page }) => {
    // Navigate to URL
    await page.goto("https://www.saucedemo.com/");

    // Fill "[name="user-name"]" with value
    await page.locator("[name=\"user-name\"]").fill("standard_user");

    // Fill "#password" with value
    await page.locator("#password").fill("secret_sauce");

    // Click element
    await page.locator("#login-button").click();

    // Navigate to URL
    await page.goto("https://www.saucedemo.com/inventory.html");

    // Waiting to page 
    await page.waitForTimeout(3000)

    // Assert text is visible on page
    await expect(page.getByText("Swag Labs")).toBeVisible();

  });
});