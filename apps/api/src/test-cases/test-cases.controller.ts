import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
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
}
