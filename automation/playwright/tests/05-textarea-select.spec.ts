import { test, expect } from '@playwright/test';

/**
 * Test Suite: QA Practice Website - Textarea Element
 * Target: https://www.qa-practice.com/elements/textarea/single
 */
test.describe('Textarea Element', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/elements/textarea/single');
  });

  test('TC-018: Textarea page loads and textarea is visible', async ({ page }) => {
    await expect(page).toHaveURL(/\/elements\/textarea\/single/);
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('TC-019: User can type text into the textarea', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('This is a multiline\ntest message\nfor QA Practice.');
    await expect(textarea).toHaveValue('This is a multiline\ntest message\nfor QA Practice.');
  });

  test('TC-020: Textarea can be cleared', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('some existing text');
    await textarea.clear();
    await expect(textarea).toHaveValue('');
  });

  test('TC-021: Textarea accepts long text input', async ({ page }) => {
    const longText = 'Lorem ipsum dolor sit amet, '.repeat(20);
    const textarea = page.locator('textarea').first();
    await textarea.fill(longText);
    await expect(textarea).toHaveValue(longText);
  });

  test('TC-022: Submit button is visible and clickable', async ({ page }) => {
    const button = page.locator('button[type="submit"], input[type="submit"]').first();
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });
});

/**
 * Test Suite: QA Practice Website - Select Dropdown Element
 * Target: https://www.qa-practice.com/elements/select/single_select
 */
test.describe('Select Dropdown Element', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/elements/select/single_select');
  });

  test('TC-023: Select page loads and dropdown is visible', async ({ page }) => {
    await expect(page).toHaveURL(/\/elements\/select\/single_select/);
    await expect(page.locator('select')).toBeVisible();
  });

  test('TC-024: Select dropdown has options', async ({ page }) => {
    const select = page.locator('select').first();
    const options = select.locator('option');
    await expect(options).not.toHaveCount(0);
  });

  test('TC-025: User can select an option from the dropdown', async ({ page }) => {
    const select = page.locator('select').first();
    // Get the second option value and select it
    const secondOption = select.locator('option').nth(1);
    const optionValue = await secondOption.getAttribute('value');
    if (optionValue) {
      await select.selectOption(optionValue);
      await expect(select).toHaveValue(optionValue);
    }
  });

  test('TC-026: Submit after selection shows result', async ({ page }) => {
    const select = page.locator('select').first();
    const secondOption = select.locator('option').nth(1);
    const optionValue = await secondOption.getAttribute('value');
    if (optionValue) {
      await select.selectOption(optionValue);
    }
    const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();
    await submitBtn.click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/elements\/select/);
  });
});
