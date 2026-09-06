import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TestReportsService } from './test-reports.service.js';

@Controller('reports')
export class TestReportsController {
  constructor(private readonly testReportsService: TestReportsService) {}

  @Get()
  findAll() {
    return this.testReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testReportsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.testReportsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.testReportsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testReportsService.remove(id);
  }
}
