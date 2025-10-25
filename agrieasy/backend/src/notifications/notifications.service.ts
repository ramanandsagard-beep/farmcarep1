import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(NotificationEntity) private repo: Repository<NotificationEntity>) {}

  list(userId: string) { return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } }); }

  async send(userId: string, title: string, message: string, type: 'SMS' | 'EMAIL' | 'PUSH' = 'PUSH') {
    const notification = this.repo.create({ userId, title, message, type });
    await this.repo.save(notification);

    // Mock sending
    if (type === 'SMS') {
      console.log(`Mock SMS sent to user ${userId}: ${message}`);
    } else if (type === 'EMAIL') {
      console.log(`Mock Email sent to user ${userId}: ${title} - ${message}`);
    } else {
      console.log(`Push notification for user ${userId}: ${title} - ${message}`);
    }

    return notification;
  }

  markAsRead(id: string) {
    return this.repo.update(id, { isRead: true });
  }
}
