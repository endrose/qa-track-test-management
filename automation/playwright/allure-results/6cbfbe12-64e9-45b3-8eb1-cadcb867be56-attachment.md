# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-api-reqbin.spec.ts >> ReqBin API — POST /echo/post/json >> TC-API-001: POST dengan payload valid mengembalikan status 200
- Location: tests\08-api-reqbin.spec.ts:23:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 403
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
  18  | // ─────────────────────────────────────────────────────────────────────────────
  19  | // TC-API-001 ~ 010: Positive Tests
  20  | // ─────────────────────────────────────────────────────────────────────────────
  21  | test.describe('ReqBin API — POST /echo/post/json', () => {
  22  | 
  23  |   test('TC-API-001: POST dengan payload valid mengembalikan status 200', async () => {
  24  |     const ctx = await request.newContext();
  25  |     const res = await ctx.post(API_URL, {
  26  |       headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  27  |       data: BASE_PAYLOAD,
  28  |     });
> 29  |     expect(res.status()).toBe(200);
      |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  30  |     await ctx.dispose();
  31  |   });
  32  | 
  33  |   test('TC-API-002: Response Content-Type adalah application/json', async () => {
  34  |     const ctx = await request.newContext();
  35  |     const res = await ctx.post(API_URL, {
  36  |       headers: { 'Content-Type': 'application/json' },
  37  |       data: BASE_PAYLOAD,
  38  |     });
  39  |     expect(res.headers()['content-type']).toContain('application/json');
  40  |     await ctx.dispose();
  41  |   });
  42  | 
  43  |   test('TC-API-003: Response body adalah JSON yang valid (parseable)', async () => {
  44  |     const ctx = await request.newContext();
  45  |     const res = await ctx.post(API_URL, {
  46  |       headers: { 'Content-Type': 'application/json' },
  47  |       data: BASE_PAYLOAD,
  48  |     });
  49  |     const body = await res.json();
  50  |     expect(typeof body).toBe('object');
  51  |     await ctx.dispose();
  52  |   });
  53  | 
  54  |   test('TC-API-004: Response body mengandung field "success"', async () => {
  55  |     const ctx = await request.newContext();
  56  |     const res = await ctx.post(API_URL, {
  57  |       headers: { 'Content-Type': 'application/json' },
  58  |       data: BASE_PAYLOAD,
  59  |     });
  60  |     const body = await res.json();
  61  |     expect(body).toHaveProperty('success');
  62  |     await ctx.dispose();
  63  |   });
  64  | 
  65  |   test('TC-API-005: Field "success" bernilai "true"', async () => {
  66  |     const ctx = await request.newContext();
  67  |     const res = await ctx.post(API_URL, {
  68  |       headers: { 'Content-Type': 'application/json' },
  69  |       data: BASE_PAYLOAD,
  70  |     });
  71  |     const body = await res.json();
  72  |     // ReqBin echo API mengembalikan { "success": "true" } (string)
  73  |     expect(String(body.success)).toBe('true');
  74  |     await ctx.dispose();
  75  |   });
  76  | 
  77  |   test('TC-API-006: POST dengan Id berbeda tetap mengembalikan 200', async () => {
  78  |     const ctx = await request.newContext();
  79  |     const res = await ctx.post(API_URL, {
  80  |       headers: { 'Content-Type': 'application/json' },
  81  |       data: { ...BASE_PAYLOAD, Id: 99999 },
  82  |     });
  83  |     expect(res.status()).toBe(200);
  84  |     await ctx.dispose();
  85  |   });
  86  | 
  87  |   test('TC-API-007: POST dengan Customer name berbeda tetap mengembalikan 200', async () => {
  88  |     const ctx = await request.newContext();
  89  |     const res = await ctx.post(API_URL, {
  90  |       headers: { 'Content-Type': 'application/json' },
  91  |       data: { ...BASE_PAYLOAD, Customer: 'Budi Santoso' },
  92  |     });
  93  |     expect(res.status()).toBe(200);
  94  |     await ctx.dispose();
  95  |   });
  96  | 
  97  |   test('TC-API-008: POST dengan Quantity lebih besar tetap mengembalikan 200', async () => {
  98  |     const ctx = await request.newContext();
  99  |     const res = await ctx.post(API_URL, {
  100 |       headers: { 'Content-Type': 'application/json' },
  101 |       data: { ...BASE_PAYLOAD, Quantity: 100 },
  102 |     });
  103 |     expect(res.status()).toBe(200);
  104 |     await ctx.dispose();
  105 |   });
  106 | 
  107 |   test('TC-API-009: POST dengan Price desimal tetap mengembalikan 200', async () => {
  108 |     const ctx = await request.newContext();
  109 |     const res = await ctx.post(API_URL, {
  110 |       headers: { 'Content-Type': 'application/json' },
  111 |       data: { ...BASE_PAYLOAD, Price: 99.99 },
  112 |     });
  113 |     expect(res.status()).toBe(200);
  114 |     await ctx.dispose();
  115 |   });
  116 | 
  117 |   test('TC-API-010: Response time tidak lebih dari 5 detik', async () => {
  118 |     const ctx = await request.newContext();
  119 |     const start = Date.now();
  120 |     const res = await ctx.post(API_URL, {
  121 |       headers: { 'Content-Type': 'application/json' },
  122 |       data: BASE_PAYLOAD,
  123 |     });
  124 |     const duration = Date.now() - start;
  125 |     expect(res.status()).toBe(200);
  126 |     expect(duration).toBeLessThan(5000);
  127 |     await ctx.dispose();
  128 |   });
  129 | 
```