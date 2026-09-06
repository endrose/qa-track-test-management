import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RequirementsService } from './requirements.service.js';

@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Get()
  findAll() {
    return this.requirementsService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.requirementsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.requirementsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requirementsService.remove(id);
  }
}
