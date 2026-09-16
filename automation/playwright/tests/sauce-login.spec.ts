import { test, expect } from '@playwright/test';

test.describe("Website Sauce", () => {
  test("Sauce Login", async ({ page }) => {
    await test.step("Given  I navigate to the login page https://www.saucedemo.com/", async () => {
      // TODO: implement step
    });

    await test.step("When I enter valid credentials username : standard_user password : secret_sauce", async () => {
      // TODO: implement step
    });

    await test.step("Then I should see dashboard https://www.saucedemo.com/inventory.html and title Swag Labs", async () => {
      // TODO: implement step
    });

  });
});