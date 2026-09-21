import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from 'database';
import { NotificationsGateway } from './notifications.gateway.js';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
    private gateway: NotificationsGateway
  ) {}

  async create(title: string, message: string, type: 'info'|'success'|'error' = 'info') {
    const notif = this.notifRepo.create({ title, message, type });
    const saved = await this.notifRepo.save(notif);
    this.gateway.emitNewNotification(saved);
    return saved;
  }

  async findAll() {
    return this.notifRepo.find({ order: { createdAt: 'DESC' }, take: 50 });
  }

  async markAsRead(id: string) {
    await this.notifRepo.update(id, { isRead: true });
    return { success: true };
  }

  async markAllAsRead() {
    await this.notifRepo.update({ isRead: false }, { isRead: true });
    return { success: true };
  }
}
