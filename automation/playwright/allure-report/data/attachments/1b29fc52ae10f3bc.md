# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-api-reqbin.spec.ts >> ReqBin API — POST /echo/post/json >> TC-API-007: POST dengan Customer name berbeda tetap mengembalikan 200
- Location: tests\08-api-reqbin.spec.ts:94:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 403
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - text: We use
      - link "cookies" [ref=e5] [cursor=pointer]:
        - /url: /cookies
      - text: . By continuing, you consent to their use.
    - button "OK" [ref=e7] [cursor=pointer]
  - navigation [ref=e8]:
    - link "REQBIN" [ref=e9] [cursor=pointer]:
      - /url: /
    - generic [ref=e12]:
      - generic [ref=e14]:
        - link "API Tester" [ref=e15] [cursor=pointer]:
          - /url: /
        - link "Curl Online" [ref=e16] [cursor=pointer]:
          - /url: /curl
      - generic [ref=e18]:
        - link "Premium" [ref=e19] [cursor=pointer]:
          - /url: /premium
        - button "Contact" [ref=e21] [cursor=pointer]
        - button "Account" [ref=e22] [cursor=pointer]
  - generic [ref=e24]:
    - navigation [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e27]: Examples
        - list [ref=e29]:
          - listitem [ref=e30]:
            - link "POST JSON Example" [ref=e31] [cursor=pointer]:
              - /url: /req/4rwevrqh/post-json-example
          - listitem [ref=e32]:
            - link "POST Request Example" [ref=e33] [cursor=pointer]:
              - /url: /req/zvtstmpb/post-request-example
          - listitem [ref=e34]:
            - link "REST API POST Example" [ref=e35] [cursor=pointer]:
              - /url: /req/v0crmky0/rest-api-post-example
          - listitem [ref=e36]:
            - link "REST API GET Example" [ref=e37] [cursor=pointer]:
              - /url: /req/chcn9woc/rest-api-get-example
          - listitem [ref=e38]:
            - link "GET Request Example" [ref=e39] [cursor=pointer]:
              - /url: /req/nfilsyk5/get-request-example
          - listitem [ref=e40]:
            - link "POST JSON Bearer Token Auth Header" [ref=e41] [cursor=pointer]:
              - /url: /req/h4rnefmw/post-json-with-bearer-token-authorization-header
          - listitem [ref=e42]:
            - link "JSON Payload Example" [ref=e43] [cursor=pointer]:
              - /url: /req/2xhbguy8/json-payload-example
          - listitem [ref=e44]:
            - link "JSON Content Type Example" [ref=e45] [cursor=pointer]:
              - /url: /req/abghm4zf/json-content-type
          - listitem [ref=e46]:
            - link "JSON Response Example" [ref=e47] [cursor=pointer]:
              - /url: /req/gzezk8d5/json-response-example
          - listitem [ref=e48]:
            - link "Authorization Bearer Header" [ref=e49] [cursor=pointer]:
              - /url: /req/adf8b77i/authorization-bearer-header
          - listitem [ref=e50]:
            - link "GET JSON Example" [ref=e51] [cursor=pointer]:
              - /url: /req/5nqtoxbx/get-json-example
          - listitem [ref=e52]:
            - link "JSON Pagination Example" [ref=e53] [cursor=pointer]:
              - /url: /req/yqyqa5ve/json-pagination-example
          - listitem [ref=e54]:
            - link "POST HTML Form Example" [ref=e55] [cursor=pointer]:
              - /url: /req/yjok4snr/post-html-form-example
          - listitem [ref=e56]:
            - link "POST XML Example" [ref=e57] [cursor=pointer]:
              - /url: /req/3mrxjgw4/post-xml-example
          - listitem [ref=e58]:
            - link "GET Request Retrieve JSON" [ref=e59] [cursor=pointer]:
              - /url: /req/ewk2va7p/get-request-to-retrieve-a-json
          - listitem [ref=e60]:
            - link "Keep Alive Connection" [ref=e61] [cursor=pointer]:
              - /url: /req/4sa9kqvu/keep-alive-connection-example
          - listitem [ref=e62]:
            - link "POST JSON String Basic Authentication" [ref=e63] [cursor=pointer]:
              - /url: /req/o3vugw0p/post-json-string-with-basic-authentication
          - listitem [ref=e64]:
            - link "GET Bearer Token Auth Header" [ref=e65] [cursor=pointer]:
              - /url: /req/5k564bhv/get-request-bearer-token-authorization-header-example
          - listitem [ref=e66]:
            - link "Sample API POST Request" [ref=e67] [cursor=pointer]:
              - /url: /req/ala1tavu/sample-api-post-request
          - listitem [ref=e68]:
            - link "Make SOAP Request Example" [ref=e69] [cursor=pointer]:
              - /url: /req/yemanjjt/make-soap-request
          - listitem [ref=e70]:
            - link "HTTP Headers Prevent Caching" [ref=e71] [cursor=pointer]:
              - /url: /req/doog8aai/http-headers-to-prevent-caching
          - listitem [ref=e72]:
            - link "POST Content Length Header" [ref=e73] [cursor=pointer]:
              - /url: /req/b3tqmhxa/post-request-with-content-length-header
          - listitem [ref=e74]:
            - link "Test JSON Request Online" [ref=e75] [cursor=pointer]:
              - /url: /req/kdgssafi/test-json-request-online
          - listitem [ref=e76]:
            - link "PUT Request Example" [ref=e77] [cursor=pointer]:
              - /url: /req/p2fujlvb/put-request-example
          - listitem [ref=e78]:
            - link "Request Cookies Example" [ref=e79] [cursor=pointer]:
              - /url: /req/fujwv25t/request-cookies
    - main [ref=e80]:
      - generic [ref=e81]:
        - generic [ref=e83]:
          - generic [ref=e84]:
            - generic [ref=e87]:
              - generic [ref=e88]:
                - heading "Online REST & SOAP API Testing Tool" [level=1] [ref=e89]
                - text: ReqBin is an online API testing tool for REST and SOAP APIs. Test API endpoints by making API requests directly from your browser. Test API responses with built-in JSON, XML, HTML and CSS validators. Generate code snippets for API automation testing frameworks. Share and discuss your API requests online.
              - link "Beta Try the new online ReqBin App — Redesigned UI. Swagger support Open app.reqbin.com →" [ref=e90] [cursor=pointer]:
                - /url: https://app.reqbin.com
                - generic [ref=e91]: Beta
                - generic [ref=e92]: Try the new online ReqBin App — Redesigned UI. Swagger support
                - generic [ref=e93]: Open app.reqbin.com →
              - generic [ref=e94]:
                - generic [ref=e96]:
                  - generic [ref=e97]:
                    - generic [ref=e99]:
                      - generic [ref=e100]: "Name:"
                      - textbox "Request name" [ref=e101]:
                        - /placeholder: enter name (optional)
                    - toolbar [ref=e102]:
                      - button "Save" [ref=e103] [cursor=pointer]
                      - button "Share" [ref=e107] [cursor=pointer]
                      - button "Generate Code" [ref=e112] [cursor=pointer]: Generate
                  - generic [ref=e115]:
                    - generic [ref=e117]:
                      - textbox "Url" [active] [ref=e118]:
                        - /placeholder: https://google.com or CURL command
                      - combobox "Method" [ref=e119] [cursor=pointer]:
                        - option "GET" [selected]
                        - option "POST"
                        - option "PUT"
                        - option "PATCH"
                        - option "DELETE"
                        - option "HEAD"
                        - option "OPTIONS"
                    - button "Send" [ref=e122] [cursor=pointer]
                  - tablist [ref=e124]:
                    - tab "Params" [ref=e125] [cursor=pointer]
                    - tab "Body" [ref=e126] [cursor=pointer]
                    - tab "Auth" [ref=e127] [cursor=pointer]
                    - tab "Headers" [ref=e128] [cursor=pointer]
                    - tab "Raw" [ref=e129] [cursor=pointer]
                  - generic [ref=e130]:
                    - tabpanel [ref=e131]:
                      - generic [ref=e133]:
                        - generic [ref=e134]:
                          - paragraph [ref=e135]: Query Params
                          - button "Copy query parameters" [ref=e138] [cursor=pointer]
                        - table [ref=e142]:
                          - rowgroup [ref=e148]:
                            - row [ref=e149]:
                              - columnheader [ref=e150]:
                                - checkbox "Select all rows" [ref=e151]
                              - columnheader "Key" [ref=e152]
                              - columnheader "Value" [ref=e154]
                              - columnheader [ref=e155]
                          - rowgroup [ref=e156]:
                            - row [ref=e157]:
                              - cell [ref=e158]
                              - cell "key" [ref=e159]
                              - cell "value" [ref=e160]
                              - cell [ref=e161]
                            - row [ref=e162]:
                              - cell [ref=e163]
                              - cell "key" [ref=e164]
                              - cell "value" [ref=e165]
                              - cell [ref=e166]
                            - row [ref=e167]:
                              - cell [ref=e168]
                              - cell "key" [ref=e169]
                              - cell "value" [ref=e170]
                              - cell [ref=e171]
                    - text: key value key value key value
                - text: key value key value key value
            - article [ref=e172]:
              - generic [ref=e173]:
                - generic [ref=e174]:
                  - text: "Updated:"
                  - time [ref=e175]: Sep 04, 2026
                - generic [ref=e177]:
                  - text: "Author:"
                  - link "ReqBin" [ref=e178] [cursor=pointer]:
                    - /url: https://reqbin.com/about
              - generic [ref=e180]:
                - heading "About ReqBin REST & SOAP Online API Testing Tool" [level=3] [ref=e181]
                - paragraph [ref=e182]: ReqBin is an online API testing tool for REST, SOAP and HTTP APIs. Paste an endpoint URL, pick a method, and send the request from your browser — no account, no install. You get back the status code, the response time in milliseconds, and the response body, formatted and validated. Save requests in the cloud, share a link with colleagues, or put it in your documentation.
                - complementary
                - list [ref=e183]:
                  - listitem [ref=e184]: Test APIs, websites and web services online.
                  - listitem [ref=e185]:
                    - link "Post requests" [ref=e186] [cursor=pointer]:
                      - /url: /post-online
                    - text: directly from your browser without installing any additional software on your computer.
                  - listitem [ref=e187]: "Accurate Timing: ReqBin API Tester shows the execution time of API requests to the millisecond, allowing you to identify performance bottlenecks and areas for optimizing your requests by reducing response times and latency."
                  - listitem [ref=e188]: Validate server responses with built-in JSON, XML, HTML, and CSS validators. Verify that the returned data matches the specified format and contains no errors.
                  - listitem [ref=e189]: "Share and Collaborate: Share a link to your API requests with colleagues or stakeholders, or place links to them in your documentation. Start discussions about your requests to get feedback and ideas, and collaborate with other developers."
                  - listitem [ref=e190]: Generate PHP, Python, JavaScript/AJAX, Node.js, Java, C#/.NET, and Curl/Bash code snippets from your requests with just one click and speed up your development process.
                  - listitem [ref=e191]: "It's safe: you don't need to install browser plugins or software on your computer. Enter your request details and click \"Send\" to make the request and see the result. All data is transmitted only via secure SSL channels."
                  - listitem [ref=e192]: "It's free: send API requests right now, without creating an account or installing anything."
                - paragraph [ref=e193]: ReqBin API test nodes are located in the US and EU, which you can use to compare API performance metrics for users across geographic regions.
                - complementary
                - heading "What is API?" [level=3] [ref=e194]
                - paragraph [ref=e195]: API (Application Programming Interface) is a computing interface that defines how software components interact with each other. It is a way of programmatically interacting with a separate software component or resource and expose functionality for internal or external use and testing. API defines what requests can be made, how they will be made and hides complexity from developers. API extends systems to partners, organizes code, and makes components reusable.
                - heading "What is API testing?" [level=3] [ref=e196]
                - paragraph [ref=e197]:
                  - text: API testing is a set of quality assurance actions that include making calls to an
                  - link "API endpoint" [ref=e198] [cursor=pointer]:
                    - /url: /req/zvxdp4hd/test-api-endpoint
                  - text: ", getting API responses, and validating API status codes, response times, and data against predefined rules. API testing is usually performed by a software tool or web service and mainly focuses on testing the business logic layer."
                - heading "Why is API Testing Important?" [level=3] [ref=e199]
                - paragraph [ref=e200]: API testing determines whether the API meets expectations for functionality, reliability, performance, and security. API testing is essential for the entire development, implementation and maintenance of APIs. API testing is necessary to accompany the API to make it functional and ready for its purpose.
                - heading "What Are API Testing Tools?" [level=3] [ref=e201]
                - paragraph [ref=e202]:
                  - text: "API testing tools send requests to an API endpoint and check the response against what you expect: status code, response time, headers, and body. They come in four forms. Desktop clients such as Postman or Insomnia install on your machine. Command-line clients such as curl send the same request from a terminal or a shell script; you can"
                  - link "run curl commands online" [ref=e203] [cursor=pointer]:
                    - /url: /curl
                  - text: here without installing anything. Online API testing tools such as ReqBin run in the browser with nothing to install. Automation frameworks run the same checks inside a CI pipeline.
                - complementary
                - paragraph [ref=e204]: ReqBin fits when you need to check an endpoint now rather than build a test suite. Teams that need a full API testing platform with scheduled monitoring or load generation use dedicated software; teams that need a quick API checker use a browser tool.
                - heading "Online Alternative to Postman" [level=3] [ref=e205]
                - paragraph [ref=e206]: "ReqBin is a Postman online alternative for API testing that runs in your browser: paste the endpoint URL, pick a method, and click Send. Nothing to install and no login required. You get the status code, millisecond accurate timings, and the response body formatted and validated. You can save the request in the cloud, share a link to it, or generate code from your requests."
                - heading "How do I Test API Online?" [level=3] [ref=e207]
                - paragraph [ref=e208]: "You can test API online by composing and executing various API requests right from your browser. A test means sending a request to the API endpoint and checking three things in the response: the HTTP status code, the response time, and the returned data. To test API online: 1. Enter the URL of the API endpoint and select the appropriate HTTP method. 2. In the Body tab, enter the data you want to send to the API endpoint. 3. If your API server requires authorization, enter your credentials in the Auth tab. 4. Click Send to submit your API request, check the returned API status code, response time, and content. 5. Re-run the API tests by changing the API endpoint URL, HTTP method, and request data."
                - heading "Test API with Online REST API Client" [level=3] [ref=e209]
                - complementary
                - paragraph [ref=e210]: ReqBin has been testing APIs from the browser since 2022. More than a million developers have used it since. You can test your API by sending API requests to REST API endpoints directly from your browser. ReqBin API Tester provides millisecond accurate timings for API requests and server responses. The REST API client works right in your browser. No coding. No desktop app. Fully online.
                - heading "REST API Examples" [level=3] [ref=e211]
                - paragraph [ref=e212]:
                  - text: Learn REST API best practices by browsing a collection of real-world
                  - link "REST API examples" [ref=e213] [cursor=pointer]:
                    - /url: /req/nxtbvm4f/rest-api-example
                  - text: .
              - generic [ref=e214]:
                - heading "Related API Tester examples and articles" [level=2] [ref=e215]
                - generic [ref=e216]:
                  - link "How do I test JSON API?" [ref=e217] [cursor=pointer]:
                    - /url: /req/enuzjzmm/test-json-api
                  - link "How do I test a REST API online?" [ref=e218] [cursor=pointer]:
                    - /url: /req/y36kls3x/test-rest-api-online
                  - link "How do I send a JSON API requests?" [ref=e219] [cursor=pointer]:
                    - /url: /req/8rng6ed1/json-api-client
                  - link "How do I get JSON from a REST API endpoint?" [ref=e220] [cursor=pointer]:
                    - /url: /req/chcn9woc/rest-api-get-example
                  - link "How do I post request to JSON API?" [ref=e221] [cursor=pointer]:
                    - /url: /req/j1lmcm1r/json-api-example
                  - link "How to test API Endpoint?" [ref=e222] [cursor=pointer]:
                    - /url: /req/zvxdp4hd/test-api-endpoint
                  - link "How to send request to the REST API endpoint?" [ref=e223] [cursor=pointer]:
                    - /url: /req/nxtbvm4f/rest-api-example
                  - link "How do I test server response time?" [ref=e224] [cursor=pointer]:
                    - /url: /req/l5ppewyl/test-server-response-time
          - complementary [ref=e225]:
            - link "Remove ads" [ref=e228] [cursor=pointer]:
              - /url: /premium
        - generic [ref=e230]:
          - generic [ref=e231]:
            - generic [ref=e232]:
              - generic [ref=e233]: Copyright © 2026 ReqBin. All Rights Reserved.
              - generic [ref=e234]:
                - link "About" [ref=e235] [cursor=pointer]:
                  - /url: /about
                - link "Privacy" [ref=e236] [cursor=pointer]:
                  - /url: /privacy
                - link "Terms" [ref=e237] [cursor=pointer]:
                  - /url: /terms
                - link "Cookies" [ref=e238] [cursor=pointer]:
                  - /url: /cookies
                - link "Premium" [ref=e239] [cursor=pointer]:
                  - /url: /premium
            - generic [ref=e240]:
              - link "Curl" [ref=e241] [cursor=pointer]:
                - /url: /curl
              - link "Python" [ref=e242] [cursor=pointer]:
                - /url: /code/python
              - link "JavaScript" [ref=e243] [cursor=pointer]:
                - /url: /code/javascript
              - link "PHP" [ref=e244] [cursor=pointer]:
                - /url: /code/php
              - link "Java" [ref=e245] [cursor=pointer]:
                - /url: /code/java
              - link "JSON" [ref=e246] [cursor=pointer]:
                - /url: /json-formatter
              - link "XML" [ref=e247] [cursor=pointer]:
                - /url: /xml-formatter
          - complementary
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Test Suite: ReqBin API Testing — menggunakan browser context penuh
  5   |  * Target: https://reqbin.com/echo/post/json
  6   |  * Format: { "Id": 78912, "Customer": "Jason Sweet", "Quantity": 1, "Price": 18.00 }
  7   |  *
  8   |  * Pendekatan: page.evaluate() untuk menjalankan fetch dari dalam browser,
  9   |  * sehingga session cookies & CSRF token otomatis terbawa (bypass bot protection).
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
  21  | /**
  22  |  * Helper: kirim POST dari dalam browser context (memiliki cookies asli)
  23  |  */
  24  | async function postFromBrowser(page: any, data: object): Promise<{ status: number; body: any }> {
  25  |   return page.evaluate(async ({ url, payload }: { url: string; payload: object }) => {
  26  |     const res = await fetch(url, {
  27  |       method: 'POST',
  28  |       headers: {
  29  |         'Content-Type': 'application/json',
  30  |         'Accept': 'application/json',
  31  |       },
  32  |       body: JSON.stringify(payload),
  33  |     });
  34  |     let body: any = null;
  35  |     try { body = await res.json(); } catch { body = {}; }
  36  |     return { status: res.status, body };
  37  |   }, { url: API_URL, payload: data });
  38  | }
  39  | 
  40  | test.describe('ReqBin API — POST /echo/post/json', () => {
  41  |   // Setiap test menggunakan browser yang sudah visit halaman reqbin untuk mendapat session
  42  |   test.beforeEach(async ({ page }) => {
  43  |     await page.goto('https://reqbin.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  44  |     await page.waitForTimeout(1500); // tunggu session cookie terbentuk
  45  |   });
  46  | 
  47  |   // ─────────────────────────────────────────────────────────────────────────
  48  |   // TC-API-001 ~ 010: Positive Tests
  49  |   // ─────────────────────────────────────────────────────────────────────────
  50  | 
  51  |   test('TC-API-001: POST dengan payload valid mengembalikan status 200', async ({ page }) => {
  52  |     const { status } = await postFromBrowser(page, BASE_PAYLOAD);
  53  |     expect(status).toBe(200);
  54  |   });
  55  | 
  56  |   test('TC-API-002: Response Content-Type adalah application/json', async ({ page }) => {
  57  |     const res = await page.evaluate(async ({ url, payload }: { url: string; payload: object }) => {
  58  |       const r = await fetch(url, {
  59  |         method: 'POST',
  60  |         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  61  |         body: JSON.stringify(payload),
  62  |       });
  63  |       return { status: r.status, contentType: r.headers.get('content-type') };
  64  |     }, { url: API_URL, payload: BASE_PAYLOAD });
  65  |     expect(res.status).toBe(200);
  66  |     expect(res.contentType).toContain('application/json');
  67  |   });
  68  | 
  69  |   test('TC-API-003: Response body adalah JSON yang valid (parseable)', async ({ page }) => {
  70  |     const { status, body } = await postFromBrowser(page, BASE_PAYLOAD);
  71  |     expect(status).toBe(200);
  72  |     expect(typeof body).toBe('object');
  73  |     expect(body).not.toBeNull();
  74  |   });
  75  | 
  76  |   test('TC-API-004: Response body mengandung field "success"', async ({ page }) => {
  77  |     const { status, body } = await postFromBrowser(page, BASE_PAYLOAD);
  78  |     expect(status).toBe(200);
  79  |     expect(body).toHaveProperty('success');
  80  |   });
  81  | 
  82  |   test('TC-API-005: Field "success" bernilai "true"', async ({ page }) => {
  83  |     const { status, body } = await postFromBrowser(page, BASE_PAYLOAD);
  84  |     expect(status).toBe(200);
  85  |     // ReqBin echo mengembalikan { "success": "true" } sebagai string
  86  |     expect(String(body.success)).toBe('true');
  87  |   });
  88  | 
  89  |   test('TC-API-006: POST dengan Id berbeda tetap mengembalikan 200', async ({ page }) => {
  90  |     const { status } = await postFromBrowser(page, { ...BASE_PAYLOAD, Id: 99999 });
  91  |     expect(status).toBe(200);
  92  |   });
  93  | 
  94  |   test('TC-API-007: POST dengan Customer name berbeda tetap mengembalikan 200', async ({ page }) => {
  95  |     const { status } = await postFromBrowser(page, { ...BASE_PAYLOAD, Customer: 'Budi Santoso' });
> 96  |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  97  |   });
  98  | 
  99  |   test('TC-API-008: POST dengan Quantity lebih besar tetap mengembalikan 200', async ({ page }) => {
  100 |     const { status } = await postFromBrowser(page, { ...BASE_PAYLOAD, Quantity: 100 });
  101 |     expect(status).toBe(200);
  102 |   });
  103 | 
  104 |   test('TC-API-009: POST dengan Price desimal tetap mengembalikan 200', async ({ page }) => {
  105 |     const { status } = await postFromBrowser(page, { ...BASE_PAYLOAD, Price: 99.99 });
  106 |     expect(status).toBe(200);
  107 |   });
  108 | 
  109 |   test('TC-API-010: Response time tidak lebih dari 5 detik', async ({ page }) => {
  110 |     const result = await page.evaluate(async ({ url, payload }: { url: string; payload: object }) => {
  111 |       const start = Date.now();
  112 |       const r = await fetch(url, {
  113 |         method: 'POST',
  114 |         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  115 |         body: JSON.stringify(payload),
  116 |       });
  117 |       return { status: r.status, duration: Date.now() - start };
  118 |     }, { url: API_URL, payload: BASE_PAYLOAD });
  119 |     expect(result.status).toBe(200);
  120 |     expect(result.duration).toBeLessThan(5000);
  121 |   });
  122 | 
  123 |   // ─────────────────────────────────────────────────────────────────────────
  124 |   // TC-API-011 ~ 015: Edge Cases & Negative Tests
  125 |   // ─────────────────────────────────────────────────────────────────────────
  126 | 
  127 |   test('TC-API-011: POST dengan extra field tidak menyebabkan server error (5xx)', async ({ page }) => {
  128 |     const { status } = await postFromBrowser(page, { ...BASE_PAYLOAD, ExtraField: 'test', Notes: 'unit test' });
  129 |     expect(status).toBeLessThan(500);
  130 |   });
  131 | 
  132 |   test('TC-API-012: POST dengan payload kosong tidak crash server (bukan 5xx)', async ({ page }) => {
  133 |     const { status } = await postFromBrowser(page, {});
  134 |     expect(status).toBeLessThan(500);
  135 |   });
  136 | 
  137 |   test('TC-API-013: POST dengan Price = 0 tidak menyebabkan server error', async ({ page }) => {
  138 |     const { status } = await postFromBrowser(page, { ...BASE_PAYLOAD, Price: 0 });
  139 |     expect(status).toBeLessThan(500);
  140 |   });
  141 | 
  142 |   test('TC-API-014: POST dengan Quantity = 0 tidak menyebabkan server error', async ({ page }) => {
  143 |     const { status } = await postFromBrowser(page, { ...BASE_PAYLOAD, Quantity: 0 });
  144 |     expect(status).toBeLessThan(500);
  145 |   });
  146 | 
  147 |   test('TC-API-015: POST dengan Customer string panjang tidak crash server', async ({ page }) => {
  148 |     const { status } = await postFromBrowser(page, { ...BASE_PAYLOAD, Customer: 'A'.repeat(200) });
  149 |     expect(status).toBeLessThan(500);
  150 |   });
  151 | });
  152 | 
```