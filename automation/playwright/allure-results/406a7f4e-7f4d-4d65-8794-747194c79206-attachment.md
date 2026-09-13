# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: verifikasi-halaman-sauce.spec.ts >> Website Sauce >> Verifikasi Halaman Sauce
- Location: tests\verifikasi-halaman-sauce.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('[name="user-name"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - main [ref=e5]:
    - form "Login" [ref=e9]:
      - textbox "Username" [ref=e11]
      - textbox "Password" [ref=e13]
      - button "Login" [ref=e15] [cursor=pointer]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "Accepted usernames are:" [level=4] [ref=e19]
        - text: standard_userlocked_out_userproblem_userperformance_glitch_usererror_uservisual_user
      - generic [ref=e20]:
        - heading "Password for all users:" [level=4] [ref=e21]
        - text: secret_sauce
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe("Website Sauce", () => {
  4  |   test("Verifikasi Halaman Sauce", async ({ page }) => {
  5  |     // Navigate to URL
  6  |     await page.goto("https://www.saucedemo.com/");
  7  | 
  8  |     // Fill "[name="user-name"]" with value
> 9  |     await page.getByTestId("[name=\"user-name\"]").fill("standard_user");
     |                                                    ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  10 | 
  11 |     // Fill "[name="password"]" with value
  12 |     await page.getByTestId("[name=\"password\"]").fill("secret_sauce");
  13 | 
  14 |     // Click element
  15 |     await page.getByTestId("#login-button").click();
  16 | 
  17 |     // Assert element is visible
  18 |     await expect(page.locator("//*[@id=\"header_container\"]/div[1]/div[2]/div")).toBeVisible();
  19 | 
  20 |   });
  21 | });
```