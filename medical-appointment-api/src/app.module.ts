import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { MedecinsModule } from './medecins/medecins.module';
import { AdminModule } from './admin/admin.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditService } from './common/services/audit.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PatientsModule,
    MedecinsModule,
    AdminModule,
    TimeslotsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuditService],
  exports: [AuditService],
})
export class AppModule {}
