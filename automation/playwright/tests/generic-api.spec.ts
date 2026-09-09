import { test, expect, request } from '@playwright/test';

/**
 * Generic API Test Runner
 * This script is executed dynamically from the backend for data-driven Test Cases.
 * It reads the test configuration from the `TEST_CASE_CONFIG` environment variable.
 */

test.describe('Generic Data-Driven API Test', () => {
  let config: any = {};

  test.beforeAll(() => {
    try {
      const configStr = process.env.TEST_CASE_CONFIG;
      if (configStr) {
        config = JSON.parse(configStr);
      }
    } catch (e) {
      console.error('Failed to parse TEST_CASE_CONFIG:', e);
    }
  });

  test('Execute dynamic API request based on UI configuration', async () => {
    if (!config.url || !config.method) {
      test.skip(true, 'No valid URL or Method provided in the configuration');
      return;
    }

    const ctx = await request.newContext({ ignoreHTTPSErrors: true });
    
    console.log(`Executing ${config.method} to ${config.url}`);
    
    // Default headers if none provided
    const headers = config.headers || { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    
    const requestOptions: any = { headers };
    
    if (config.body && ['POST', 'PUT', 'PATCH'].includes(config.method.toUpperCase())) {
      // Assuming body is JSON
      requestOptions.data = typeof config.body === 'string' ? JSON.parse(config.body) : config.body;
    }

    const startTime = Date.now();
    let res;
    
    // Execute request
    switch (config.method.toUpperCase()) {
      case 'GET': res = await ctx.get(config.url, requestOptions); break;
      case 'POST': res = await ctx.post(config.url, requestOptions); break;
      case 'PUT': res = await ctx.put(config.url, requestOptions); break;
      case 'DELETE': res = await ctx.delete(config.url, requestOptions); break;
      case 'PATCH': res = await ctx.patch(config.url, requestOptions); break;
      default:
        throw new Error(`Unsupported method: ${config.method}`);
    }

    const duration = Date.now() - startTime;
    console.log(`Response received in ${duration}ms with status ${res.status()}`);
    
    // Extract response body
    let responseBody: any = null;
    try {
      responseBody = await res.json();
    } catch {
      responseBody = await res.text();
    }

    // Process Assertions
    if (config.expectedStatus) {
      expect(res.status(), `Expected status ${config.expectedStatus} but got ${res.status()}`).toBe(parseInt(config.expectedStatus));
    }
    
    // Add more advanced assertions here based on your config structure if needed
    if (config.expectedTextInBody) {
      const bodyStr = typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody);
      expect(bodyStr, `Expected body to contain "${config.expectedTextInBody}"`).toContain(config.expectedTextInBody);
    }

    await ctx.dispose();
  });
});
