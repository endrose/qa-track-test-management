# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-api-reqbin.spec.ts >> ReqBin API — POST /echo/post/json >> TC-API-003: Response body adalah JSON yang valid (parseable)
- Location: tests\08-api-reqbin.spec.ts:53:7

# Error details

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

# Test source

```ts
  1   | import { test, expect, request } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Test Suite: ReqBin API Testing
  5   |  * Target: https://reqbin.com/echo/post/json
  6   |  * Format: { "Id": 78912, "Customer": "Jason Sweet", "Quantity": 1, "Price": 18.00 }
  7   |  */
  8   | 
  9   | const API_URL = 'https://reqbin.com/echo/post/json';
  10  | 
  11  | const BASE_PAYLOAD = {
  12  |   Id: 78912,
  13  |   Customer: 'Jason Sweet',
  14  |   Quantity: 1,
  15  |   Price: 18.00,
  16  | };
  17  | 
  18  | // ReqBin memerlukan header browser agar tidak diblokir (403)
  19  | const BROWSER_HEADERS = {
  20  |   'Content-Type': 'application/json',
  21  |   'Accept': 'application/json',
  22  |   'Origin': 'https://reqbin.com',
  23  |   'Referer': 'https://reqbin.com/',
  24  |   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  25  |   'X-Requested-With': 'XMLHttpRequest',
  26  | };
  27  | 
  28  | // ─────────────────────────────────────────────────────────────────────────────
  29  | // TC-API-001 ~ 010: Positive Tests
  30  | // ─────────────────────────────────────────────────────────────────────────────
  31  | test.describe('ReqBin API — POST /echo/post/json', () => {
  32  | 
  33  |   test('TC-API-001: POST dengan payload valid mengembalikan status 200', async () => {
  34  |     const ctx = await request.newContext();
  35  |     const res = await ctx.post(API_URL, {
  36  |       headers: BROWSER_HEADERS,
  37  |       data: BASE_PAYLOAD,
  38  |     });
  39  |     expect(res.status()).toBe(200);
  40  |     await ctx.dispose();
  41  |   });
  42  | 
  43  |   test('TC-API-002: Response Content-Type adalah application/json', async () => {
  44  |     const ctx = await request.newContext();
  45  |     const res = await ctx.post(API_URL, {
  46  |       headers: BROWSER_HEADERS,
  47  |       data: BASE_PAYLOAD,
  48  |     });
  49  |     expect(res.headers()['content-type']).toContain('application/json');
  50  |     await ctx.dispose();
  51  |   });
  52  | 
  53  |   test('TC-API-003: Response body adalah JSON yang valid (parseable)', async () => {
  54  |     const ctx = await request.newContext();
  55  |     const res = await ctx.post(API_URL, {
  56  |       headers: BROWSER_HEADERS,
  57  |       data: BASE_PAYLOAD,
  58  |     });
> 59  |     const body = await res.json();
      |                  ^ SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
  60  |     expect(typeof body).toBe('object');
  61  |     await ctx.dispose();
  62  |   });
  63  | 
  64  |   test('TC-API-004: Response body mengandung field "success"', async () => {
  65  |     const ctx = await request.newContext();
  66  |     const res = await ctx.post(API_URL, {
  67  |       headers: BROWSER_HEADERS,
  68  |       data: BASE_PAYLOAD,
  69  |     });
  70  |     const body = await res.json();
  71  |     expect(body).toHaveProperty('success');
  72  |     await ctx.dispose();
  73  |   });
  74  | 
  75  |   test('TC-API-005: Field "success" bernilai "true"', async () => {
  76  |     const ctx = await request.newContext();
  77  |     const res = await ctx.post(API_URL, {
  78  |       headers: BROWSER_HEADERS,
  79  |       data: BASE_PAYLOAD,
  80  |     });
  81  |     const body = await res.json();
  82  |     // ReqBin echo API mengembalikan { "success": "true" } (string)
  83  |     expect(String(body.success)).toBe('true');
  84  |     await ctx.dispose();
  85  |   });
  86  | 
  87  |   test('TC-API-006: POST dengan Id berbeda tetap mengembalikan 200', async () => {
  88  |     const ctx = await request.newContext();
  89  |     const res = await ctx.post(API_URL, {
  90  |       headers: BROWSER_HEADERS,
  91  |       data: { ...BASE_PAYLOAD, Id: 99999 },
  92  |     });
  93  |     expect(res.status()).toBe(200);
  94  |     await ctx.dispose();
  95  |   });
  96  | 
  97  |   test('TC-API-007: POST dengan Customer name berbeda tetap mengembalikan 200', async () => {
  98  |     const ctx = await request.newContext();
  99  |     const res = await ctx.post(API_URL, {
  100 |       headers: BROWSER_HEADERS,
  101 |       data: { ...BASE_PAYLOAD, Customer: 'Budi Santoso' },
  102 |     });
  103 |     expect(res.status()).toBe(200);
  104 |     await ctx.dispose();
  105 |   });
  106 | 
  107 |   test('TC-API-008: POST dengan Quantity lebih besar tetap mengembalikan 200', async () => {
  108 |     const ctx = await request.newContext();
  109 |     const res = await ctx.post(API_URL, {
  110 |       headers: BROWSER_HEADERS,
  111 |       data: { ...BASE_PAYLOAD, Quantity: 100 },
  112 |     });
  113 |     expect(res.status()).toBe(200);
  114 |     await ctx.dispose();
  115 |   });
  116 | 
  117 |   test('TC-API-009: POST dengan Price desimal tetap mengembalikan 200', async () => {
  118 |     const ctx = await request.newContext();
  119 |     const res = await ctx.post(API_URL, {
  120 |       headers: BROWSER_HEADERS,
  121 |       data: { ...BASE_PAYLOAD, Price: 99.99 },
  122 |     });
  123 |     expect(res.status()).toBe(200);
  124 |     await ctx.dispose();
  125 |   });
  126 | 
  127 |   test('TC-API-010: Response time tidak lebih dari 5 detik', async () => {
  128 |     const ctx = await request.newContext();
  129 |     const start = Date.now();
  130 |     const res = await ctx.post(API_URL, {
  131 |       headers: BROWSER_HEADERS,
  132 |       data: BASE_PAYLOAD,
  133 |     });
  134 |     const duration = Date.now() - start;
  135 |     expect(res.status()).toBe(200);
  136 |     expect(duration).toBeLessThan(5000);
  137 |     await ctx.dispose();
  138 |   });
  139 | 
  140 |   // ─────────────────────────────────────────────────────────────────────────
  141 |   // TC-API-011 ~ 015: Edge Cases & Negative Tests
  142 |   // ─────────────────────────────────────────────────────────────────────────
  143 | 
  144 |   test('TC-API-011: POST dengan extra field tidak menyebabkan error', async () => {
  145 |     const ctx = await request.newContext();
  146 |     const res = await ctx.post(API_URL, {
  147 |       headers: BROWSER_HEADERS,
  148 |       data: { ...BASE_PAYLOAD, ExtraField: 'test', Notes: 'unit test' },
  149 |     });
  150 |     expect(res.status()).toBeLessThan(500);
  151 |     await ctx.dispose();
  152 |   });
  153 | 
  154 |   test('TC-API-012: POST dengan payload kosong tidak crash server (bukan 5xx)', async () => {
  155 |     const ctx = await request.newContext();
  156 |     const res = await ctx.post(API_URL, {
  157 |       headers: BROWSER_HEADERS,
  158 |       data: {},
  159 |     });
```