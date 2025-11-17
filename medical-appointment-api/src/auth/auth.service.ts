import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(registerDto.motDePasse, 10);

    // Créer l'utilisateur
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
        // Les médecins doivent être validés par l'admin
        statutValidation: registerDto.role === 'MEDECIN' ? 'PENDING' : 'APPROVED',
        // Les médecins ne sont pas actifs tant qu'ils ne sont pas approuvés
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

    // Si c'est un médecin en attente de validation, ne pas générer de tokens
    if (user.role === 'MEDECIN' && user.statutValidation === 'PENDING') {
      // Log registration (médecin waiting for approval)
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

    // Générer les tokens pour les autres utilisateurs
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Sauvegarder le refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // Log successful registration
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

  async login(loginDto: LoginDto) {
    // Trouver l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      // Log failed login attempt
      await this.auditService.logLogin(
        loginDto.email,
        undefined,
        undefined,
        'failed',
      );
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le statut de validation pour les médecins (avant la vérification isActive)
    if (user.role === 'MEDECIN') {
      if (user.statutValidation === 'PENDING') {
        await this.auditService.logLogin(
          `${user.prenom} ${user.nom}`,
          user.id,
          undefined,
          'failed',
        );
        throw new UnauthorizedException('Votre compte est en attente de validation par un administrateur');
      }
      if (user.statutValidation === 'REJECTED') {
        await this.auditService.logLogin(
          `${user.prenom} ${user.nom}`,
          user.id,
          undefined,
          'failed',
        );
        throw new UnauthorizedException('Votre demande d\'inscription a été rejetée. Veuillez contacter l\'administration.');
      }
    }

    // Vérifier si l'utilisateur est actif (pour les autres raisons de désactivation)
    if (!user.isActive) {
      await this.auditService.logLogin(
        `${user.prenom} ${user.nom}`,
        user.id,
        undefined,
        'failed',
      );
      throw new UnauthorizedException('Compte désactivé');
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(
      loginDto.motDePasse,
      user.motDePasse,
    );

    if (!passwordMatch) {
      await this.auditService.logLogin(
        `${user.prenom} ${user.nom}`,
        user.id,
        undefined,
        'failed',
      );
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer les tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Sauvegarder le refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // Log successful login
    await this.auditService.logLogin(
      `${user.prenom} ${user.nom}`,
      user.id,
      undefined,
      'success',
    );

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

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken || !user.isActive) {
        throw new UnauthorizedException();
      }

      const refreshTokenMatch = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatch) {
        throw new UnauthorizedException();
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  async logout(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { nom: true, prenom: true },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    // Log logout
    if (user) {
      await this.auditService.logLogout(
        `${user.prenom} ${user.nom}`,
        userId,
      );
    }

    return { message: 'Déconnexion réussie' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: (this.configService.get<string>('JWT_EXPIRATION') || '15m') as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d') as any,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
