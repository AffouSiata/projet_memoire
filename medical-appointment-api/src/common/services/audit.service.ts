import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface AuditLogData {
  userId?: string;
  userName: string;
  userRole?: string;
  action: string;
  entity?: string;
  entityId?: string;
  ip?: string;
  userAgent?: string;
  status: 'success' | 'failed' | 'warning';
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogData) {
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
      // Don't throw errors for audit logging failures
      console.error('Audit log error:', error);
    }
  }

  async logLogin(
    userName: string,
    userId?: string,
    ip?: string,
    status: 'success' | 'failed' = 'success',
  ) {
    await this.log({
      userId,
      userName,
      action: status === 'success' ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      entity: 'User',
      entityId: userId,
      ip,
      status,
    });
  }

  async logLogout(userName: string, userId: string, ip?: string) {
    await this.log({
      userId,
      userName,
      action: 'LOGOUT',
      entity: 'User',
      entityId: userId,
      ip,
      status: 'success',
    });
  }

  async getAuditLogs(options?: {
    userId?: string;
    action?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (options?.userId) {
      where.userId = options.userId;
    }
    if (options?.action) {
      where.action = options.action;
    }
    if (options?.status) {
      where.status = options.status;
    }
    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt.gte = options.startDate;
      }
      if (options.endDate) {
        where.createdAt.lte = options.endDate;
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }
}
