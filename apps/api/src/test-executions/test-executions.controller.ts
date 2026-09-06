import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TestExecutionsService } from './test-executions.service.js';

@Controller('test-executions')
export class TestExecutionsController {
  constructor(private readonly testExecutionsService: TestExecutionsService) {}

  @Get()
  findAll() {
    return this.testExecutionsService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.testExecutionsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.testExecutionsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testExecutionsService.remove(id);
  }
}
