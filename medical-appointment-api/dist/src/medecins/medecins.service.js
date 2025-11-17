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
exports.MedecinsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let MedecinsService = class MedecinsService {
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
                adresse: true,
                role: true,
                specialite: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async updateProfile(userId, updateMedecinDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: updateMedecinDto,
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                adresse: true,
                specialite: true,
            },
        });
        return user;
    }
    async getRendezVous(userId, filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;
        const where = {
            medecinId: userId,
        };
        if (filters?.statut) {
            where.statut = filters.statut;
        }
        if (filters?.patientId) {
            where.patientId = filters.patientId;
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
                    patient: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
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
    async updateRendezVous(userId, rendezVousId, updateRendezVousDto) {
        const rendezvous = await this.prisma.rendezVous.findUnique({
            where: { id: rendezVousId },
            include: {
                patient: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                        preferencesNotifEmail: true,
                        preferencesNotifSms: true,
                    },
                },
            },
        });
        if (!rendezvous) {
            throw new common_1.NotFoundException('Rendez-vous non trouvé');
        }
        if (rendezvous.medecinId !== userId) {
            throw new common_1.ForbiddenException('Accès interdit');
        }
        const medecin = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                nom: true,
                prenom: true,
            },
        });
        if (!medecin) {
            throw new common_1.NotFoundException('Médecin non trouvé');
        }
        if (updateRendezVousDto.date) {
            const newDate = new Date(updateRendezVousDto.date);
            if (newDate < new Date()) {
                throw new common_1.BadRequestException('La date doit être dans le futur');
            }
            const existingAppointment = await this.prisma.rendezVous.findFirst({
                where: {
                    medecinId: userId,
                    date: newDate,
                    id: { not: rendezVousId },
                    statut: {
                        in: [client_1.StatutRendezVous.CONFIRME, client_1.StatutRendezVous.EN_ATTENTE],
                    },
                },
            });
            if (existingAppointment) {
                throw new common_1.BadRequestException('Créneau déjà réservé');
            }
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
                        telephone: true,
                    },
                },
            },
        });
        if (updateRendezVousDto.statut === client_1.StatutRendezVous.ANNULE &&
            rendezvous.statut !== client_1.StatutRendezVous.ANNULE) {
            try {
                await this.notificationsService.sendAppointmentCancellation(rendezvous.patient.id, `${rendezvous.patient.prenom} ${rendezvous.patient.nom}`, rendezvous.patient.email, rendezvous.patient.telephone, `${medecin.prenom} ${medecin.nom}`, rendezvous.date, rendezvous.patient.preferencesNotifEmail, rendezvous.patient.preferencesNotifSms);
            }
            catch (error) {
                console.error('Erreur lors de l\'envoi de la notification d\'annulation:', error);
            }
        }
        return updated;
    }
    async getPatients(userId, filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const patients = await this.prisma.user.findMany({
            where: {
                role: 'PATIENT',
                rendezvousPatient: {
                    some: {
                        medecinId: userId,
                    },
                },
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                dateNaissance: true,
                _count: {
                    select: {
                        rendezvousPatient: {
                            where: {
                                medecinId: userId,
                            },
                        },
                    },
                },
            },
            skip,
            take: limit,
            orderBy: { nom: 'asc' },
        });
        const total = await this.prisma.user.count({
            where: {
                role: 'PATIENT',
                rendezvousPatient: {
                    some: {
                        medecinId: userId,
                    },
                },
            },
        });
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
    async getNotes(userId, filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            medecinId: userId,
        };
        if (filters?.patientId) {
            where.patientId = filters.patientId;
        }
        if (filters?.statut) {
            where.statut = filters.statut;
        }
        const [notes, total] = await Promise.all([
            this.prisma.noteMedicale.findMany({
                where,
                include: {
                    patient: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.noteMedicale.count({ where }),
        ]);
        return {
            data: notes,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createNote(userId, createNoteDto) {
        const patient = await this.prisma.user.findUnique({
            where: { id: createNoteDto.patientId },
        });
        if (!patient || patient.role !== 'PATIENT') {
            throw new common_1.BadRequestException('Patient non trouvé');
        }
        const hasAppointment = await this.prisma.rendezVous.findFirst({
            where: {
                patientId: createNoteDto.patientId,
                medecinId: userId,
            },
        });
        if (!hasAppointment) {
            throw new common_1.ForbiddenException('Vous devez avoir un rendez-vous avec ce patient pour créer une note');
        }
        const note = await this.prisma.noteMedicale.create({
            data: {
                medecinId: userId,
                patientId: createNoteDto.patientId,
                contenu: createNoteDto.contenu,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
            },
        });
        return note;
    }
    async updateNote(userId, noteId, updateNoteDto) {
        const note = await this.prisma.noteMedicale.findUnique({
            where: { id: noteId },
        });
        if (!note) {
            throw new common_1.NotFoundException('Note non trouvée');
        }
        if (note.medecinId !== userId) {
            throw new common_1.ForbiddenException('Accès interdit');
        }
        const updated = await this.prisma.noteMedicale.update({
            where: { id: noteId },
            data: updateNoteDto,
            include: {
                patient: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
            },
        });
        return updated;
    }
    async deleteNote(userId, noteId) {
        const note = await this.prisma.noteMedicale.findUnique({
            where: { id: noteId },
        });
        if (!note) {
            throw new common_1.NotFoundException('Note non trouvée');
        }
        if (note.medecinId !== userId) {
            throw new common_1.ForbiddenException('Accès interdit');
        }
        await this.prisma.noteMedicale.delete({
            where: { id: noteId },
        });
        return { message: 'Note supprimée avec succès' };
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
    async uploadAttachment(userId, noteId, filePath) {
        const note = await this.prisma.noteMedicale.findUnique({
            where: { id: noteId },
        });
        if (!note) {
            throw new common_1.NotFoundException('Note non trouvée');
        }
        if (note.medecinId !== userId) {
            throw new common_1.ForbiddenException('Accès interdit');
        }
        const updated = await this.prisma.noteMedicale.update({
            where: { id: noteId },
            data: {
                piecesJointes: {
                    push: filePath,
                },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
            },
        });
        return updated;
    }
};
exports.MedecinsService = MedecinsService;
exports.MedecinsService = MedecinsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], MedecinsService);
//# sourceMappingURL=medecins.service.js.map