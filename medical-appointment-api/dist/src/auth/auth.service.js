"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../common/services/audit.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    auditService;
    constructor(prisma, jwtService, configService, auditService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.auditService = auditService;
    }
    async register(registerDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Cet email est déjà utilisé');
        }
        const hashedPassword = await bcrypt.hash(registerDto.motDePasse, 10);
        const user = await this.prisma.user.create({
            data: {
                nom: registerDto.nom,
                prenom: registerDto.prenom,
                email: registerDto.email,
                motDePasse: hashedPassword,
                role: registerDto.role,
                telephone: registerDto.telephone,
                dateNaissance: registerDto.dateNaissance
                    ? new Date(registerDto.dateNaissance)
                    : null,
                adresse: registerDto.adresse,
                specialite: registerDto.specialite,
                numeroOrdre: registerDto.numeroOrdre,
                statutValidation: registerDto.role === 'MEDECIN' ? 'PENDING' : 'APPROVED',
                isActive: registerDto.role === 'MEDECIN' ? false : true,
            },
            select: {
                id: true,
                email: true,
                nom: true,
                prenom: true,
                role: true,
                statutValidation: true,
            },
        });
        if (user.role === 'MEDECIN' && user.statutValidation === 'PENDING') {
            await this.auditService.log({
                userId: user.id,
                userName: `${user.prenom} ${user.nom}`,
                userRole: user.role,
                action: 'REGISTER_MEDECIN_PENDING',
                entity: 'User',
                entityId: user.id,
                status: 'warning',
            });
            return {
                message: 'Votre demande d\'inscription a été envoyée. Un administrateur va la valider sous peu.',
                user: {
                    id: user.id,
                    email: user.email,
                    nom: user.nom,
                    prenom: user.prenom,
                    role: user.role,
                    statutValidation: user.statutValidation,
                },
                requiresApproval: true,
            };
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        await this.auditService.log({
            userId: user.id,
            userName: `${user.prenom} ${user.nom}`,
            userRole: user.role,
            action: 'REGISTER_SUCCESS',
            entity: 'User',
            entityId: user.id,
            status: 'success',
        });
        return {
            user,
            ...tokens,
        };
    }
    async login(loginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });
        if (!user) {
            await this.auditService.logLogin(loginDto.email, undefined, undefined, 'failed');
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        if (user.role === 'MEDECIN') {
            if (user.statutValidation === 'PENDING') {
                await this.auditService.logLogin(`${user.prenom} ${user.nom}`, user.id, undefined, 'failed');
                throw new common_1.UnauthorizedException('Votre compte est en attente de validation par un administrateur');
            }
            if (user.statutValidation === 'REJECTED') {
                await this.auditService.logLogin(`${user.prenom} ${user.nom}`, user.id, undefined, 'failed');
                throw new common_1.UnauthorizedException('Votre demande d\'inscription a été rejetée. Veuillez contacter l\'administration.');
            }
        }
        if (!user.isActive) {
            await this.auditService.logLogin(`${user.prenom} ${user.nom}`, user.id, undefined, 'failed');
            throw new common_1.UnauthorizedException('Compte désactivé');
        }
        const passwordMatch = await bcrypt.compare(loginDto.motDePasse, user.motDePasse);
        if (!passwordMatch) {
            await this.auditService.logLogin(`${user.prenom} ${user.nom}`, user.id, undefined, 'failed');
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        await this.auditService.logLogin(`${user.prenom} ${user.nom}`, user.id, undefined, 'success');
        return {
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
            },
            ...tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || !user.refreshToken || !user.isActive) {
                throw new common_1.UnauthorizedException();
            }
            const refreshTokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!refreshTokenMatch) {
                throw new common_1.UnauthorizedException();
            }
            const tokens = await this.generateTokens(user.id, user.email, user.role);
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token invalide ou expiré');
        }
    }
    async logout(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { nom: true, prenom: true },
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        if (user) {
            await this.auditService.logLogout(`${user.prenom} ${user.nom}`, userId);
        }
        return { message: 'Déconnexion réussie' };
    }
    async generateTokens(userId, email, role) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, role }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: (this.configService.get('JWT_EXPIRATION') || '15m'),
            }),
            this.jwtService.signAsync({ sub: userId, email, role }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: (this.configService.get('JWT_REFRESH_EXPIRATION') || '7d'),
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map