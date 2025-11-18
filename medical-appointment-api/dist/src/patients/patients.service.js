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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let PatientsService = class PatientsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                dateNaissance: true,
                adresse: true,
                role: true,
                preferencesNotifEmail: true,
                preferencesNotifSms: true,
                preferencesNotifPush: true,
                preferencesRappels: true,
                preferencesPromotions: true,
                theme: true,
                couleurAccent: true,
                langue: true,
                twoFactorAuth: true,
                biometricAuth: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async updateProfile(userId, updatePatientDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...updatePatientDto,
                dateNaissance: updatePatientDto.dateNaissance
                    ? new Date(updatePatientDto.dateNaissance)
                    : undefined,
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                dateNaissance: true,
                adresse: true,
            },
        });
        return user;
    }
    async updatePassword(userId, updatePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const passwordMatch = await bcrypt.compare(updatePasswordDto.ancienMotDePasse, user.motDePasse);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Mot de passe incorrect');
        }
        const hashedPassword = await bcrypt.hash(updatePasswordDto.nouveauMotDePasse, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { motDePasse: hashedPassword },
        });
        return { message: 'Mot de passe mis à jour avec succès' };
    }
    async getRendezVous(userId, filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;
        const where = {
            patientId: userId,
        };
        if (filters?.statut) {
            where.statut = filters.statut;
        }
        if (filters?.medecinId) {
            where.medecinId = filters.medecinId;
        }
        if (filters?.type === 'passe') {
            where.date = { lt: new Date() };
        }
        else if (filters?.type === 'futur') {
            where.date = { gte: new Date() };
        }
        const [rendezvous, total] = await Promise.all([
            this.prisma.rendezVous.findMany({
                where,
                include: {
                    medecin: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            specialite: true,
                        },
                    },
                },
                orderBy: { date: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.rendezVous.count({ where }),
        ]);
        return {
            data: rendezvous,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createRendezVous(userId, createRendezVousDto) {
        const patient = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                preferencesNotifEmail: true,
                preferencesNotifSms: true,
                preferencesRappels: true,
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient non trouvé');
        }
        const medecin = await this.prisma.user.findUnique({
            where: { id: createRendezVousDto.medecinId },
        });
        if (!medecin || medecin.role !== 'MEDECIN') {
            throw new common_1.BadRequestException('Médecin non trouvé');
        }
        const appointmentDate = new Date(createRendezVousDto.date);
        if (appointmentDate < new Date()) {
            throw new common_1.BadRequestException('La date doit être dans le futur');
        }
        const existingAppointment = await this.prisma.rendezVous.findFirst({
            where: {
                medecinId: createRendezVousDto.medecinId,
                date: appointmentDate,
                statut: {
                    in: [client_1.StatutRendezVous.CONFIRME, client_1.StatutRendezVous.EN_ATTENTE],
                },
            },
        });
        if (existingAppointment) {
            throw new common_1.BadRequestException('Créneau déjà réservé');
        }
        const rendezvous = await this.prisma.rendezVous.create({
            data: {
                patientId: userId,
                medecinId: createRendezVousDto.medecinId,
                date: appointmentDate,
                motif: createRendezVousDto.motif,
            },
            include: {
                medecin: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        specialite: true,
                    },
                },
            },
        });
        try {
            await this.notificationsService.createNotification(patient.id, 'CONFIRMATION', 'Demande de rendez-vous reçue', `Votre demande de rendez-vous avec Dr. ${medecin.prenom} ${medecin.nom} pour le ${appointmentDate.toLocaleDateString('fr-FR')} a été reçue et est en attente de confirmation.`);
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
        }
        return rendezvous;
    }
    async getNotifications(userId, filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            userId,
        };
        if (filters?.lue !== undefined) {
            where.lue = filters.lue;
        }
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.notification.count({ where }),
        ]);
        return {
            data: notifications,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async markNotificationsAsRead(userId, notificationIds) {
        const where = {
            userId,
            lue: false,
        };
        if (notificationIds && notificationIds.length > 0) {
            where.id = { in: notificationIds };
        }
        const result = await this.prisma.notification.updateMany({
            where,
            data: { lue: true },
        });
        return {
            message: `${result.count} notification(s) marquée(s) comme lue(s)`,
        };
    }
    async updatePreferences(userId, updatePreferencesDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: updatePreferencesDto,
            select: {
                preferencesNotifEmail: true,
                preferencesNotifSms: true,
                preferencesNotifPush: true,
                preferencesRappels: true,
                preferencesPromotions: true,
                theme: true,
                couleurAccent: true,
                langue: true,
                twoFactorAuth: true,
                biometricAuth: true,
            },
        });
        return user;
    }
    async getMedecins(specialite) {
        const where = {
            role: 'MEDECIN',
            statutValidation: 'APPROVED',
            isActive: true,
        };
        if (specialite) {
            where.specialite = specialite;
        }
        const medecins = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                nom: true,
                prenom: true,
                specialite: true,
                email: true,
            },
            orderBy: {
                nom: 'asc',
            },
        });
        return medecins;
    }
    async updateRendezVousStatus(userId, rendezvousId, statut) {
        if (statut !== client_1.StatutRendezVous.ANNULE) {
            throw new common_1.BadRequestException('Les patients ne peuvent qu\'annuler leurs rendez-vous. Seul le médecin peut confirmer un rendez-vous.');
        }
        const rendezvous = await this.prisma.rendezVous.findFirst({
            where: {
                id: rendezvousId,
                patientId: userId,
            },
            include: {
                medecin: true,
                patient: true,
            },
        });
        if (!rendezvous) {
            throw new common_1.NotFoundException('Rendez-vous non trouvé');
        }
        if (rendezvous.statut === client_1.StatutRendezVous.ANNULE) {
            throw new common_1.BadRequestException('Ce rendez-vous est déjà annulé');
        }
        const updatedRendezVous = await this.prisma.rendezVous.update({
            where: { id: rendezvousId },
            data: { statut },
            include: {
                medecin: true,
                patient: true,
            },
        });
        await this.notificationsService.createNotification(rendezvous.medecinId, 'ANNULATION', 'Rendez-vous annulé', `Le patient ${rendezvous.patient.prenom} ${rendezvous.patient.nom} a annulé son rendez-vous du ${new Date(rendezvous.date).toLocaleDateString('fr-FR')}`);
        try {
            await this.notificationsService.sendAppointmentCancellation(rendezvous.patient.id, `${rendezvous.patient.prenom} ${rendezvous.patient.nom}`, rendezvous.patient.email, rendezvous.patient.telephone || '', `${rendezvous.medecin.prenom} ${rendezvous.medecin.nom}`, rendezvous.date, rendezvous.patient.preferencesNotifEmail ?? true, rendezvous.patient.preferencesNotifSms ?? false);
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de la notification d\'annulation au patient:', error);
        }
        return {
            success: true,
            message: 'Rendez-vous annulé avec succès',
            data: updatedRendezVous,
        };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map