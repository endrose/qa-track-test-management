import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
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

  @Post('generate-script')
  generateScript(@Body() body: { title: string; projectName: string; steps: any[] }) {
    return this.automationService.generateScript(body);
  }

  @Get('scan-url')
  scanUrl(@Query('url') url: string) {
    return this.automationService.scanUrl(url);
  }

  @Get('scripts')
  getScripts(@Query('framework') framework: string) {
    return this.automationService.getScripts(framework);
  }

  @Get('scripts/:filename')
  getScriptContent(@Param('filename') filename: string, @Query('framework') framework: string) {
    return this.automationService.getScriptContent(filename, framework);
  }

  @Put('scripts/:filename')
  updateScript(@Param('filename') filename: string, @Body() body: { content: string }, @Query('framework') framework: string) {
    return this.automationService.updateScript(filename, body.content, framework);
  }

  @Delete('scripts/:filename')
  deleteScript(@Param('filename') filename: string, @Query('framework') framework: string) {
    return this.automationService.deleteScript(filename, framework);
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
