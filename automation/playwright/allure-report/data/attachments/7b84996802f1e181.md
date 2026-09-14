# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-homepage.spec.ts >> Homepage >> TC-001: Homepage loads and has correct title
- Location: tests\01-homepage.spec.ts:8:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://www.qa-practice.com/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - list [ref=e8]:
      - listitem [ref=e9]:
        - link "Homepage" [ref=e10] [cursor=pointer]:
          - /url: /
      - listitem [ref=e11]:
        - link " Single UI Elements" [ref=e12] [cursor=pointer]:
          - /url: javascript:;
          - generic [ref=e13]: 
          - text: Single UI Elements
      - listitem [ref=e14]:
        - link " Forms" [ref=e15] [cursor=pointer]:
          - /url: javascript:;
          - generic [ref=e16]: 
          - text: Forms
    - generic [ref=e18]:
      - heading "Hello!" [level=1] [ref=e19]
      - paragraph [ref=e20]: This site is designed to gain practical skills in testing. It can be useful for both people studying manual testing and automated testing. Here is a collection of various web elements and requirements for them. The number and complexity of elements will gradually increase.
      - paragraph [ref=e21]: "Not sure where to start? Try testing these simple elements:"
      - list [ref=e22]:
        - listitem [ref=e23]:
          - link "Text input" [ref=e24] [cursor=pointer]:
            - /url: /elements/input/simple
        - listitem [ref=e25]:
          - link "Simple button" [ref=e26] [cursor=pointer]:
            - /url: /elements/button/simple
        - listitem [ref=e27]:
          - link "Single checkbox" [ref=e28] [cursor=pointer]:
            - /url: /elements/checkbox/single_checkbox
        - listitem [ref=e29]:
          - link "Text area" [ref=e30] [cursor=pointer]:
            - /url: /elements/textarea/single
        - listitem [ref=e31]:
          - link "Select input" [ref=e32] [cursor=pointer]:
            - /url: /elements/select/single_select
  - generic [ref=e33]:
    - link "Contact" [ref=e34] [cursor=pointer]:
      - /url: /contact/
    - link "What's new" [ref=e35] [cursor=pointer]:
      - /url: /whats_new/
  - contentinfo [ref=e36]:
    - generic [ref=e37]:
      - text: "© 2026 Copyright:"
      - link "www.qa-practice.com" [ref=e38] [cursor=pointer]:
        - /url: https://www.qa-practice.com/
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * Test Suite: QA Practice Website - Homepage & Navigation
  5  |  * Target: https://www.qa-practice.com/
  6  |  */
  7  | test.describe('Homepage', () => {
  8  |   test('TC-001: Homepage loads and has correct title', async ({ page }) => {
> 9  |     await page.goto('/');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  10 |     await expect(page).toHaveTitle(/Home Page | QA Practice/);
  11 |   });
  12 | 
  13 |   test('TC-002: Homepage displays welcome heading', async ({ page }) => {
  14 |     await page.goto('/');
  15 |     await expect(page.locator('h1')).toContainText('Hello!');
  16 |   });
  17 | 
  18 |   test('TC-003: Quick start links are visible on homepage', async ({ page }) => {
  19 |     await page.goto('/');
  20 |     await expect(page.getByRole('link', { name: 'Text input' })).toBeVisible();
  21 |     await expect(page.getByRole('link', { name: 'Simple button' })).toBeVisible();
  22 |     await expect(page.getByRole('link', { name: 'Single checkbox' })).toBeVisible();
  23 |     await expect(page.getByRole('link', { name: 'Text area' })).toBeVisible();
  24 |     await expect(page.getByRole('link', { name: 'Select input' })).toBeVisible();
  25 |   });
  26 | });
  27 | 
```