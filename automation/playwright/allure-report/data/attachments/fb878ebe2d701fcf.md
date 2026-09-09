# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-api-reqbin.spec.ts >> ReqBin API — POST /echo/post/json >> TC-API-008: POST dengan Quantity lebih besar tetap mengembalikan 200
- Location: tests\08-api-reqbin.spec.ts:104:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 403
```

# Test source

```ts
  7   |  *
  8   |  * CATATAN: ReqBin membatasi rate request — setiap test menggunakan context baru
  9   |  * dan delay antar request untuk menghindari 403 dari rate limiter.
  10  |  */
  11  | 
  12  | const API_URL = 'https://reqbin.com/echo/post/json';
  13  | 
  14  | const BASE_PAYLOAD = {
  15  |   Id: 78912,
  16  |   Customer: 'Jason Sweet',
  17  |   Quantity: 1,
  18  |   Price: 18.00,
  19  | };
  20  | 
  21  | const BROWSER_HEADERS = {
  22  |   'Content-Type': 'application/json',
  23  |   'Accept': 'application/json, text/plain, */*',
  24  |   'Origin': 'https://reqbin.com',
  25  |   'Referer': 'https://reqbin.com/',
  26  |   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  27  |   'X-Requested-With': 'XMLHttpRequest',
  28  |   'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  29  |   'sec-ch-ua-platform': '"Windows"',
  30  | };
  31  | 
  32  | // Helper: delay antar request supaya tidak kena rate limit
  33  | const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  34  | 
  35  | // Helper: buat request dan retry jika 403 (rate limit)
  36  | async function postWithRetry(data: object, retries = 3): Promise<{ status: number; body: any }> {
  37  |   for (let i = 0; i < retries; i++) {
  38  |     const ctx = await request.newContext({ ignoreHTTPSErrors: true });
  39  |     const res = await ctx.post(API_URL, { headers: BROWSER_HEADERS, data });
  40  |     const status = res.status();
  41  |     let body: any = null;
  42  |     try { body = await res.json(); } catch { body = {}; }
  43  |     await ctx.dispose();
  44  |     if (status !== 403) return { status, body };
  45  |     await delay(3000 * (i + 1)); // backoff: 3s, 6s, 9s
  46  |   }
  47  |   return { status: 403, body: null };
  48  | }
  49  | 
  50  | // ─────────────────────────────────────────────────────────────────────────────
  51  | // TC-API-001 ~ 010: Positive Tests
  52  | // ─────────────────────────────────────────────────────────────────────────────
  53  | test.describe('ReqBin API — POST /echo/post/json', () => {
  54  | 
  55  |   // Slow down tests to avoid rate limiting
  56  |   test.slow();
  57  | 
  58  |   test('TC-API-001: POST dengan payload valid mengembalikan status 200', async () => {
  59  |     const { status } = await postWithRetry(BASE_PAYLOAD);
  60  |     expect(status).toBe(200);
  61  |   });
  62  | 
  63  |   test('TC-API-002: Response Content-Type adalah application/json', async () => {
  64  |     await delay(2000);
  65  |     const ctx = await request.newContext();
  66  |     const res = await ctx.post(API_URL, { headers: BROWSER_HEADERS, data: BASE_PAYLOAD });
  67  |     expect(res.headers()['content-type']).toContain('application/json');
  68  |     await ctx.dispose();
  69  |   });
  70  | 
  71  |   test('TC-API-003: Response body adalah JSON yang valid (parseable)', async () => {
  72  |     await delay(2000);
  73  |     const { status, body } = await postWithRetry(BASE_PAYLOAD);
  74  |     expect(status).toBe(200);
  75  |     expect(typeof body).toBe('object');
  76  |   });
  77  | 
  78  |   test('TC-API-004: Response body mengandung field "success"', async () => {
  79  |     await delay(2000);
  80  |     const { status, body } = await postWithRetry(BASE_PAYLOAD);
  81  |     expect(status).toBe(200);
  82  |     expect(body).toHaveProperty('success');
  83  |   });
  84  | 
  85  |   test('TC-API-005: Field "success" bernilai "true"', async () => {
  86  |     await delay(2000);
  87  |     const { status, body } = await postWithRetry(BASE_PAYLOAD);
  88  |     expect(status).toBe(200);
  89  |     expect(String(body.success)).toBe('true');
  90  |   });
  91  | 
  92  |   test('TC-API-006: POST dengan Id berbeda tetap mengembalikan 200', async () => {
  93  |     await delay(2000);
  94  |     const { status } = await postWithRetry({ ...BASE_PAYLOAD, Id: 99999 });
  95  |     expect(status).toBe(200);
  96  |   });
  97  | 
  98  |   test('TC-API-007: POST dengan Customer name berbeda tetap mengembalikan 200', async () => {
  99  |     await delay(2000);
  100 |     const { status } = await postWithRetry({ ...BASE_PAYLOAD, Customer: 'Budi Santoso' });
  101 |     expect(status).toBe(200);
  102 |   });
  103 | 
  104 |   test('TC-API-008: POST dengan Quantity lebih besar tetap mengembalikan 200', async () => {
  105 |     await delay(2000);
  106 |     const { status } = await postWithRetry({ ...BASE_PAYLOAD, Quantity: 100 });
> 107 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  108 |   });
  109 | 
  110 |   test('TC-API-009: POST dengan Price desimal tetap mengembalikan 200', async () => {
  111 |     await delay(2000);
  112 |     const { status } = await postWithRetry({ ...BASE_PAYLOAD, Price: 99.99 });
  113 |     expect(status).toBe(200);
  114 |   });
  115 | 
  116 |   test('TC-API-010: Response time tidak lebih dari 5 detik', async () => {
  117 |     await delay(2000);
  118 |     const ctx = await request.newContext();
  119 |     const start = Date.now();
  120 |     const res = await ctx.post(API_URL, { headers: BROWSER_HEADERS, data: BASE_PAYLOAD });
  121 |     const duration = Date.now() - start;
  122 |     const status = res.status();
  123 |     await ctx.dispose();
  124 |     // Jika masih 403 karena rate limit, skip assertion duration
  125 |     if (status === 200) {
  126 |       expect(duration).toBeLessThan(5000);
  127 |     }
  128 |     expect([200, 403]).toContain(status); // Acceptable: 200 or rate-limited 403
  129 |   });
  130 | 
  131 |   // ─────────────────────────────────────────────────────────────────────────
  132 |   // TC-API-011 ~ 015: Edge Cases & Negative Tests
  133 |   // ─────────────────────────────────────────────────────────────────────────
  134 | 
  135 |   test('TC-API-011: POST dengan extra field tidak menyebabkan server error (5xx)', async () => {
  136 |     await delay(2000);
  137 |     const { status } = await postWithRetry({ ...BASE_PAYLOAD, ExtraField: 'test', Notes: 'unit test' });
  138 |     expect(status).toBeLessThan(500);
  139 |   });
  140 | 
  141 |   test('TC-API-012: POST dengan payload kosong tidak crash server (bukan 5xx)', async () => {
  142 |     await delay(2000);
  143 |     const { status } = await postWithRetry({});
  144 |     expect(status).toBeLessThan(500);
  145 |   });
  146 | 
  147 |   test('TC-API-013: POST dengan Price = 0 tidak menyebabkan server error', async () => {
  148 |     await delay(2000);
  149 |     const { status } = await postWithRetry({ ...BASE_PAYLOAD, Price: 0 });
  150 |     expect(status).toBeLessThan(500);
  151 |   });
  152 | 
  153 |   test('TC-API-014: POST dengan Quantity = 0 tidak menyebabkan server error', async () => {
  154 |     await delay(2000);
  155 |     const { status } = await postWithRetry({ ...BASE_PAYLOAD, Quantity: 0 });
  156 |     expect(status).toBeLessThan(500);
  157 |   });
  158 | 
  159 |   test('TC-API-015: POST dengan Customer string panjang tidak crash server', async () => {
  160 |     await delay(2000);
  161 |     const { status } = await postWithRetry({ ...BASE_PAYLOAD, Customer: 'A'.repeat(200) });
  162 |     expect(status).toBeLessThan(500);
  163 |   });
  164 | });
  165 | 
```