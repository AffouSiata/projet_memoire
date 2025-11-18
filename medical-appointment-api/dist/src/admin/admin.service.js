"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
let AdminService = class AdminService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async getPatients(filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            role: client_1.Role.PATIENT,
        };
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters?.search) {
            where.OR = [
                { nom: { contains: filters.search, mode: 'insensitive' } },
                { prenom: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        const [patients, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    nom: true,
                    prenom: true,
                    email: true,
                    telephone: true,
                    dateNaissance: true,
                    adresse: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: {
                            rendezvousPatient: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: patients,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updatePatientStatus(patientId, updateStatusDto) {
        const patient = await this.prisma.user.findUnique({
            where: { id: patientId },
        });
        if (!patient || patient.role !== client_1.Role.PATIENT) {
            throw new common_1.NotFoundException('Patient non trouvé');
        }
        const updated = await this.prisma.user.update({
            where: { id: patientId },
            data: { isActive: updateStatusDto.isActive },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                isActive: true,
            },
        });
        return updated;
    }
    async getMedecins(filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            role: client_1.Role.MEDECIN,
        };
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters?.specialite) {
            where.specialite = { contains: filters.specialite, mode: 'insensitive' };
        }
        if (filters?.statutValidation) {
            where.statutValidation = filters.statutValidation;
        }
        if (filters?.search) {
            where.OR = [
                { nom: { contains: filters.search, mode: 'insensitive' } },
                { prenom: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        const [medecins, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    nom: true,
                    prenom: true,
                    email: true,
                    telephone: true,
                    specialite: true,
                    isActive: true,
                    statutValidation: true,
                    createdAt: true,
                    _count: {
                        select: {
                            rendezvousMedecin: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: medecins,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateMedecinStatus(medecinId, updateStatusDto, adminId) {
        const medecin = await this.prisma.user.findUnique({
            where: { id: medecinId },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                specialite: true,
                isActive: true,
                role: true,
                preferencesNotifEmail: true,
                preferencesNotifSms: true,
            },
        });
        if (!medecin || medecin.role !== client_1.Role.MEDECIN) {
            throw new common_1.NotFoundException('Médecin non trouvé');
        }
        const statusChanging = medecin.isActive !== updateStatusDto.isActive;
        const updated = await this.prisma.user.update({
            where: { id: medecinId },
            data: { isActive: updateStatusDto.isActive },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                specialite: true,
                isActive: true,
            },
        });
        if (statusChanging) {
            const medecinName = `${medecin.prenom} ${medecin.nom}`;
            if (updateStatusDto.isActive) {
                await this.notificationsService.sendAccountActivation(medecin.id, medecinName, medecin.email, medecin.telephone || '', medecin.preferencesNotifEmail ?? true, medecin.preferencesNotifSms ?? false);
                await this.notificationsService.createAdminNotificationForActivation(adminId, medecinName, medecin.specialite || 'Non spécifiée');
            }
            else {
                await this.notificationsService.sendAccountDeactivation(medecin.id, medecinName, medecin.email, medecin.telephone || '', medecin.preferencesNotifEmail ?? true, medecin.preferencesNotifSms ?? false);
                await this.notificationsService.createAdminNotificationForDeactivation(adminId, medecinName, medecin.specialite || 'Non spécifiée');
            }
        }
        return updated;
    }
    async approveMedecin(medecinId, adminId) {
        const medecin = await this.prisma.user.findUnique({
            where: { id: medecinId },
        });
        if (!medecin || medecin.role !== client_1.Role.MEDECIN) {
            throw new common_1.NotFoundException('Médecin non trouvé');
        }
        if (medecin.statutValidation === client_1.StatutValidation.APPROVED) {
            throw new common_1.BadRequestException('Ce médecin est déjà approuvé');
        }
        const updated = await this.prisma.user.update({
            where: { id: medecinId },
            data: {
                statutValidation: client_1.StatutValidation.APPROVED,
                isActive: true,
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                specialite: true,
                isActive: true,
                statutValidation: true,
                preferencesNotifEmail: true,
                preferencesNotifSms: true,
            },
        });
        await this.notificationsService.sendAccountApproval(updated.id, `${updated.prenom} ${updated.nom}`, updated.email, updated.telephone || '', updated.preferencesNotifEmail ?? true, updated.preferencesNotifSms ?? false);
        await this.notificationsService.createAdminNotificationForApproval(adminId, `${updated.prenom} ${updated.nom}`, updated.specialite || 'Non spécifiée');
        return {
            message: 'Médecin approuvé avec succès',
            medecin: {
                id: updated.id,
                nom: updated.nom,
                prenom: updated.prenom,
                email: updated.email,
                specialite: updated.specialite,
                isActive: updated.isActive,
                statutValidation: updated.statutValidation,
            },
        };
    }
    async rejectMedecin(medecinId, adminId) {
        const medecin = await this.prisma.user.findUnique({
            where: { id: medecinId },
        });
        if (!medecin || medecin.role !== client_1.Role.MEDECIN) {
            throw new common_1.NotFoundException('Médecin non trouvé');
        }
        if (medecin.statutValidation === client_1.StatutValidation.REJECTED) {
            throw new common_1.BadRequestException('Ce médecin est déjà rejeté');
        }
        const updated = await this.prisma.user.update({
            where: { id: medecinId },
            data: {
                statutValidation: client_1.StatutValidation.REJECTED,
                isActive: false,
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                specialite: true,
                isActive: true,
                statutValidation: true,
                preferencesNotifEmail: true,
                preferencesNotifSms: true,
            },
        });
        await this.notificationsService.sendAccountRejection(updated.id, `${updated.prenom} ${updated.nom}`, updated.email, updated.telephone || '', updated.preferencesNotifEmail ?? true, updated.preferencesNotifSms ?? false);
        await this.notificationsService.createAdminNotificationForRejection(adminId, `${updated.prenom} ${updated.nom}`, updated.specialite || 'Non spécifiée');
        return {
            message: 'Demande du médecin rejetée',
            medecin: {
                id: updated.id,
                nom: updated.nom,
                prenom: updated.prenom,
                email: updated.email,
                specialite: updated.specialite,
                isActive: updated.isActive,
                statutValidation: updated.statutValidation,
            },
        };
    }
    async getRendezVous(filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.statut) {
            where.statut = filters.statut;
        }
        if (filters?.patientId) {
            where.patientId = filters.patientId;
        }
        if (filters?.medecinId) {
            where.medecinId = filters.medecinId;
        }
        const [rendezvous, total] = await Promise.all([
            this.prisma.rendezVous.findMany({
                where,
                include: {
                    patient: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                        },
                    },
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
    async updateRendezVous(rendezVousId, updateRendezVousDto) {
        const rendezvous = await this.prisma.rendezVous.findUnique({
            where: { id: rendezVousId },
        });
        if (!rendezvous) {
            throw new common_1.NotFoundException('Rendez-vous non trouvé');
        }
        const updated = await this.prisma.rendezVous.update({
            where: { id: rendezVousId },
            data: {
                ...updateRendezVousDto,
                date: updateRendezVousDto.date
                    ? new Date(updateRendezVousDto.date)
                    : undefined,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
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
        return updated;
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
    async getStatistics() {
        const [totalPatients, activePatients, totalMedecins, activeMedecins, totalRendezVous, rendezVousParStatut, rendezVousParMedecin, rendezVousParSpecialite,] = await Promise.all([
            this.prisma.user.count({ where: { role: client_1.Role.PATIENT } }),
            this.prisma.user.count({ where: { role: client_1.Role.PATIENT, isActive: true } }),
            this.prisma.user.count({ where: { role: client_1.Role.MEDECIN } }),
            this.prisma.user.count({ where: { role: client_1.Role.MEDECIN, isActive: true } }),
            this.prisma.rendezVous.count(),
            this.prisma.rendezVous.groupBy({
                by: ['statut'],
                _count: true,
            }),
            this.prisma.rendezVous.groupBy({
                by: ['medecinId'],
                _count: true,
                orderBy: {
                    _count: {
                        medecinId: 'desc',
                    },
                },
                take: 10,
            }),
            this.prisma.$queryRaw `
        SELECT u.specialite, COUNT(r.id)::int as count
        FROM "RendezVous" r
        JOIN "User" u ON r."medecinId" = u.id
        WHERE u.specialite IS NOT NULL
        GROUP BY u.specialite
        ORDER BY count DESC
      `,
        ]);
        const rdvAnnules = rendezVousParStatut.find((s) => s.statut === client_1.StatutRendezVous.ANNULE);
        const tauxAnnulation = totalRendezVous > 0
            ? ((rdvAnnules?._count || 0) / totalRendezVous) * 100
            : 0;
        const medecinIds = rendezVousParMedecin.map((r) => r.medecinId);
        const medecins = await this.prisma.user.findMany({
            where: { id: { in: medecinIds } },
            select: { id: true, nom: true, prenom: true, specialite: true },
        });
        const rendezVousParMedecinDetails = rendezVousParMedecin.map((r) => {
            const medecin = medecins.find((m) => m.id === r.medecinId);
            return {
                medecinId: r.medecinId,
                nom: medecin ? `${medecin.prenom} ${medecin.nom}` : 'Inconnu',
                specialite: medecin?.specialite || 'N/A',
                nombreRendezVous: r._count,
            };
        });
        return {
            utilisateurs: {
                patients: {
                    total: totalPatients,
                    actifs: activePatients,
                },
                medecins: {
                    total: totalMedecins,
                    actifs: activeMedecins,
                },
            },
            rendezVous: {
                total: totalRendezVous,
                parStatut: rendezVousParStatut.map((s) => ({
                    statut: s.statut,
                    count: s._count,
                })),
                tauxAnnulation: Math.round(tauxAnnulation * 100) / 100,
                parMedecin: rendezVousParMedecinDetails,
                parSpecialite: rendezVousParSpecialite,
            },
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                nom: true,
                prenom: true,
                telephone: true,
                preferencesNotifEmail: true,
                preferencesNotifSms: true,
                theme: true,
                langue: true,
                role: true,
            },
        });
        if (!user || user.role !== client_1.Role.ADMIN) {
            throw new common_1.NotFoundException('Administrateur non trouvé');
        }
        return user;
    }
    async updateProfile(userId, updateData) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== client_1.Role.ADMIN) {
            throw new common_1.NotFoundException('Administrateur non trouvé');
        }
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                nom: true,
                prenom: true,
                telephone: true,
                preferencesNotifEmail: true,
                preferencesNotifSms: true,
                theme: true,
                langue: true,
                role: true,
            },
        });
        return updated;
    }
    async getAuditLogs(filters) {
        const limit = filters?.limit || 20;
        const page = filters?.page || 1;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.status && filters.status !== 'all') {
            where.status = filters.status;
        }
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        const formattedLogs = logs.map((log) => ({
            id: log.id,
            user: log.userName,
            action: log.action,
            ip: log.ip || 'N/A',
            date: log.createdAt,
            status: log.status,
        }));
        return {
            data: formattedLogs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map