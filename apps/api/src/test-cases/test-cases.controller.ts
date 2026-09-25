import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { TestCasesService } from './test-cases.service.js';

@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  @Get()
  findAll() {
    return this.testCasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testCasesService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.testCasesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.testCasesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testCasesService.remove(id);
  }

  // API Proxy — forward requests to avoid CORS issues in the browser
  @Post('api-proxy')
  async apiProxy(@Body() body: { method: string; url: string; headers?: Record<string, string>; body?: string }) {
    try {
      const options: RequestInit = {
        method: body.method,
        headers: body.headers || {},
      };
      if (body.body && ['POST', 'PUT', 'PATCH'].includes(body.method)) {
        (options as any).body = body.body;
      }

      const response = await fetch(body.url, options);
      const contentType = response.headers.get('content-type') || '';
      let responseBody: any;
      try {
        responseBody = contentType.includes('application/json') ? await response.json() : await response.text();
      } catch { responseBody = await response.text(); }

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((val, key) => { responseHeaders[key] = val; });

      return {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
      };
    } catch (err: any) {
      throw new HttpException({ error: err.message || 'Proxy request failed' }, HttpStatus.BAD_GATEWAY);
    }
  }
}
