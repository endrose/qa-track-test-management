import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AutomationService } from './automation.service.js';

@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Get()
  findAll() {
    return this.automationService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.automationService.create(data);
  }

  @Post('test-cases/:id/execute')
  executeTestCase(@Param('id') id: string) {
    return this.automationService.executeTestCase(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.automationService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.automationService.remove(id);
  }
}
