import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private auditService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, auditService: AuditService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            role: "MEDECIN";
            statutValidation: "PENDING";
        };
        requiresApproval: boolean;
    } | {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            role: import("@prisma/client").$Enums.Role;
            statutValidation: import("@prisma/client").$Enums.StatutValidation | null;
        };
        message?: undefined;
        requiresApproval?: undefined;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private updateRefreshToken;
}
