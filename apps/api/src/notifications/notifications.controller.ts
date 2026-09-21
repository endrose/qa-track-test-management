import { Controller, Get, Put, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  @Get()
  findAll() {
    return this.notifService.findAll();
  }

  @Put('read-all')
  markAllAsRead() {
    return this.notifService.markAllAsRead();
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notifService.markAsRead(id);
  }
}
