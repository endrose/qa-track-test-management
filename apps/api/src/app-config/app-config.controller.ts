import { Controller, Get, Put, Body } from '@nestjs/common';
import { AppConfigService } from './app-config.service.js';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly configService: AppConfigService) {}

  @Get()
  getAll() {
    return this.configService.getAll();
  }

  @Put('telegram')
  async saveTelegram(@Body() body: { enabled: boolean; token: string; chatId: string }) {
    await this.configService.set('telegram_enabled', String(body.enabled));
    await this.configService.set('telegram_token', body.token || '');
    await this.configService.set('telegram_chat_id', body.chatId || '');
    return { success: true };
  }
}
