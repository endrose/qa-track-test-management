import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BugsService } from './bugs.service.js';

@Controller('bugs')
export class BugsController {
  constructor(private readonly bugsService: BugsService) {}

  @Get()
  findAll() {
    return this.bugsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bugsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.bugsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.bugsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bugsService.remove(id);
  }
}
