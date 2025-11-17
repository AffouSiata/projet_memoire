import { PrismaService } from '../../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(data: {
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
    }): Promise<void>;
    logLogin(userName: string, userId?: string, ip?: string, status?: 'success' | 'failed'): Promise<void>;
    logLogout(userName: string, userId: string, ip?: string): Promise<void>;
    logUserAction(userId: string, userName: string, userRole: string, action: string, entity?: string, entityId?: string, ip?: string, status?: 'success' | 'failed' | 'warning'): Promise<void>;
}
