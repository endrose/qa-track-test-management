import { chromium } from '@playwright/test';

(async () => {
  const url = process.argv[2];
  if (!url) {
    console.error('No URL provided');
    process.exit(1);
  }
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    // Ignore navigation timeout, try to extract whatever rendered anyway
  }
  
  const locators = await page.evaluate(() => {
    const elements = document.querySelectorAll('input, button, a, select, textarea');
    const selectors = new Set();
    
    elements.forEach(el => {
      if (el.id) selectors.add('#' + el.id);
      if (el.getAttribute('data-test')) selectors.add('[data-test="' + el.getAttribute('data-test') + '"]');
      if (el.getAttribute('data-testid')) selectors.add('[data-testid="' + el.getAttribute('data-testid') + '"]');
      if (el.name) selectors.add('[name="' + el.name + '"]');
      if (el.placeholder) selectors.add('[placeholder="' + el.placeholder + '"]');
    });
    
    return Array.from(selectors);
  });
  
  console.log(JSON.stringify(locators));
  await browser.close();
})();
