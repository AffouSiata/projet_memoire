import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { ReminderService } from './reminder.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, EmailService, SmsService, ReminderService],
  exports: [NotificationsService, EmailService, SmsService, ReminderService],
})
export class NotificationsModule {}
