import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    userId?: string;
    userName: string;
    userRole?: string;
    action: string;
    entity?: string;
    entityId?: string;
    ip?: string;
    userAgent?: string;
    status: 'success' | 'failed' | 'warning';
    metadata?: any;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          userName: data.userName,
          userRole: data.userRole,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          ip: data.ip,
          userAgent: data.userAgent,
          status: data.status,
          metadata: data.metadata,
        },
      });
    } catch (error) {
      // En cas d'erreur lors du logging, on ne veut pas bloquer l'application
      console.error('Erreur lors de l\'enregistrement du log d\'audit:', error);
    }
  }

  // Méthodes helper pour les actions courantes
  async logLogin(userName: string, userId?: string, ip?: string, status: 'success' | 'failed' = 'success') {
    await this.log({
      userId,
      userName,
      action: status === 'success' ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      ip,
      status,
    });
  }

  async logLogout(userName: string, userId: string, ip?: string) {
    await this.log({
      userId,
      userName,
      action: 'LOGOUT',
      ip,
      status: 'success',
    });
  }

  async logUserAction(
    userId: string,
    userName: string,
    userRole: string,
    action: string,
    entity?: string,
    entityId?: string,
    ip?: string,
    status: 'success' | 'failed' | 'warning' = 'success',
  ) {
    await this.log({
      userId,
      userName,
      userRole,
      action,
      entity,
      entityId,
      ip,
      status,
    });
  }
}
