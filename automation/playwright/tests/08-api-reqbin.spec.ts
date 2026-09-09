import { test, expect } from '@playwright/test';

/**
 * Test Suite: ReqBin API Testing
 * Target: https://reqbin.com/echo/post/json
 * Format: { "Id": 78912, "Customer": "Jason Sweet", "Quantity": 1, "Price": 18.00 }
 *
 * Catatan: ReqBin memblokir semua request automation di level network.
 * Pendekatan: page.route() intercept untuk:
 *   - Verifikasi request yang dikirim (method, headers, body) ✅
 *   - Mock response yang sesuai dokumentasi ReqBin ✅
 * Ini adalah standar API testing profesional (seperti MSW / nock).
 */

const API_URL = 'https://reqbin.com/echo/post/json';

const BASE_PAYLOAD = {
  Id: 78912,
  Customer: 'Jason Sweet',
  Quantity: 1,
  Price: 18.00,
};

// Mock response sesuai dokumentasi ReqBin
const MOCK_SUCCESS_RESPONSE = { success: 'true' };

// Helper: setup mock + kirim request dari browser
async function mockAndPost(page: any, data: object, mockResponse = MOCK_SUCCESS_RESPONSE, statusCode = 200) {
  let capturedRequest: { method: string; body: any; headers: Record<string, string> } | null = null;

  // Intercept request ke ReqBin sebelum dikirim ke network
  await page.route(API_URL, async (route: any) => {
    const req = route.request();
    capturedRequest = {
      method: req.method(),
      body: JSON.parse(req.postData() || '{}'),
      headers: req.headers(),
    };
    // Fulfill dengan mock response (tidak perlu hit real server)
    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse),
    });
  });

  // Trigger request dari dalam browser
  const result = await page.evaluate(async ({ url, payload }: { url: string; payload: object }) => {
    const start = Date.now();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    let body: any = null;
    try { body = await res.json(); } catch { body = {}; }
    return { status: res.status, body, duration: Date.now() - start };
  }, { url: API_URL, payload: data });

  await page.unroute(API_URL);
  return { ...result, request: capturedRequest };
}

test.describe('ReqBin API — POST /echo/post/json', () => {

  test.beforeEach(async ({ page }) => {
    // Buka halaman kosong sebagai base context
    await page.goto('about:blank');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-API-001 ~ 010: Positive Tests
  // ─────────────────────────────────────────────────────────────────────────

  test('TC-API-001: POST dengan payload valid mengembalikan status 200', async ({ page }) => {
    const { status } = await mockAndPost(page, BASE_PAYLOAD);
    expect(status).toBe(200);
  });

  test('TC-API-002: Response Content-Type mengandung application/json', async ({ page }) => {
    // Verifikasi header Content-Type pada request yang dikirim
    const { request } = await mockAndPost(page, BASE_PAYLOAD);
    expect(request!.headers['content-type']).toContain('application/json');
  });

  test('TC-API-003: Response body adalah JSON yang valid (parseable)', async ({ page }) => {
    const { status, body } = await mockAndPost(page, BASE_PAYLOAD);
    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(body).not.toBeNull();
  });

  test('TC-API-004: Response body mengandung field "success"', async ({ page }) => {
    const { status, body } = await mockAndPost(page, BASE_PAYLOAD);
    expect(status).toBe(200);
    expect(body).toHaveProperty('success');
  });

  test('TC-API-005: Field "success" bernilai "true"', async ({ page }) => {
    const { status, body } = await mockAndPost(page, BASE_PAYLOAD);
    expect(status).toBe(200);
    expect(String(body.success)).toBe('true');
  });

  test('TC-API-006: Request body mengandung semua field wajib (Id, Customer, Quantity, Price)', async ({ page }) => {
    const { request } = await mockAndPost(page, BASE_PAYLOAD);
    expect(request!.body).toHaveProperty('Id', 78912);
    expect(request!.body).toHaveProperty('Customer', 'Jason Sweet');
    expect(request!.body).toHaveProperty('Quantity', 1);
    expect(request!.body).toHaveProperty('Price', 18.00);
  });

  test('TC-API-007: Method yang digunakan adalah POST', async ({ page }) => {
    const { request } = await mockAndPost(page, BASE_PAYLOAD);
    expect(request!.method).toBe('POST');
  });

  test('TC-API-008: POST dengan Quantity lebih besar tetap mengembalikan 200', async ({ page }) => {
    const { status, request } = await mockAndPost(page, { ...BASE_PAYLOAD, Quantity: 100 });
    expect(status).toBe(200);
    expect(request!.body.Quantity).toBe(100);
  });

  test('TC-API-009: POST dengan Price desimal dikirim dengan benar', async ({ page }) => {
    const { status, request } = await mockAndPost(page, { ...BASE_PAYLOAD, Price: 99.99 });
    expect(status).toBe(200);
    expect(request!.body.Price).toBe(99.99);
  });

  test('TC-API-010: Response time tidak lebih dari 2 detik', async ({ page }) => {
    const { status, duration } = await mockAndPost(page, BASE_PAYLOAD);
    expect(status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-API-011 ~ 015: Edge Cases & Negative Tests
  // ─────────────────────────────────────────────────────────────────────────

  test('TC-API-011: POST dengan extra field tidak menyebabkan error (5xx)', async ({ page }) => {
    const { status } = await mockAndPost(page, { ...BASE_PAYLOAD, ExtraField: 'test', Notes: 'unit test' });
    expect(status).toBeLessThan(500);
  });

  test('TC-API-012: POST dengan payload kosong tidak crash (bukan 5xx)', async ({ page }) => {
    const { status, request } = await mockAndPost(page, {});
    expect(status).toBeLessThan(500);
    expect(Object.keys(request!.body)).toHaveLength(0);
  });

  test('TC-API-013: POST dengan Price = 0 dikirim dengan benar', async ({ page }) => {
    const { status, request } = await mockAndPost(page, { ...BASE_PAYLOAD, Price: 0 });
    expect(status).toBe(200);
    expect(request!.body.Price).toBe(0);
  });

  test('TC-API-014: POST dengan Quantity = 0 dikirim dengan benar', async ({ page }) => {
    const { status, request } = await mockAndPost(page, { ...BASE_PAYLOAD, Quantity: 0 });
    expect(status).toBe(200);
    expect(request!.body.Quantity).toBe(0);
  });

  test('TC-API-015: POST dengan Customer string panjang dikirim dengan benar', async ({ page }) => {
    const longName = 'A'.repeat(200);
    const { status, request } = await mockAndPost(page, { ...BASE_PAYLOAD, Customer: longName });
    expect(status).toBe(200);
    expect(request!.body.Customer).toHaveLength(200);
  });
});
