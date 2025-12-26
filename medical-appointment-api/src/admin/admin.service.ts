import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateRendezVousDto } from '../medecins/dto/update-rendezvous.dto';
import { Role, StatutRendezVous, StatutValidation } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // GET /admin/patients
  async getPatients(filters?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      role: Role.PATIENT,
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

  // PATCH /admin/patients/:id
  async updatePatientStatus(patientId: string, updateStatusDto: UpdateUserStatusDto) {
    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
    });

    if (!patient || patient.role !== Role.PATIENT) {
      throw new NotFoundException('Patient non trouvé');
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

  // DELETE /admin/patients/:id
  async deletePatient(patientId: string) {
    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
    });

    if (!patient || patient.role !== Role.PATIENT) {
      throw new NotFoundException('Patient non trouvé');
    }

    // Supprimer toutes les données liées au patient
    await this.prisma.$transaction(async (prisma) => {
      // Supprimer les notifications du patient
      await prisma.notification.deleteMany({
        where: { userId: patientId },
      });

      // Supprimer les rendez-vous du patient
      await prisma.rendezVous.deleteMany({
        where: { patientId },
      });

      // Supprimer les notes médicales du patient
      await prisma.noteMedicale.deleteMany({
        where: { patientId },
      });

      // Supprimer le patient
      await prisma.user.delete({
        where: { id: patientId },
      });
    });

    return {
      message: 'Patient supprimé avec succès',
      deletedId: patientId,
    };
  }

  // GET /admin/medecins
  async getMedecins(filters?: {
    search?: string;
    specialite?: string;
    isActive?: boolean;
    statutValidation?: StatutValidation;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      role: Role.MEDECIN,
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

  // PATCH /admin/medecins/:id
  async updateMedecinStatus(medecinId: string, updateStatusDto: UpdateUserStatusDto, adminId: string) {
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

    if (!medecin || medecin.role !== Role.MEDECIN) {
      throw new NotFoundException('Médecin non trouvé');
    }

    // Vérifier si le statut change
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

    // Si le statut a changé, envoyer des notifications
    if (statusChanging) {
      const medecinName = `${medecin.prenom} ${medecin.nom}`;

      if (updateStatusDto.isActive) {
        // Le compte a été activé
        await this.notificationsService.sendAccountActivation(
          medecin.id,
          medecinName,
          medecin.email,
          medecin.telephone || '',
          medecin.preferencesNotifEmail ?? true,
          medecin.preferencesNotifSms ?? false,
        );

        // Notification pour l'admin
        await this.notificationsService.createAdminNotificationForActivation(
          adminId,
          medecinName,
          medecin.specialite || 'Non spécifiée',
        );
      } else {
        // Le compte a été désactivé
        await this.notificationsService.sendAccountDeactivation(
          medecin.id,
          medecinName,
          medecin.email,
          medecin.telephone || '',
          medecin.preferencesNotifEmail ?? true,
          medecin.preferencesNotifSms ?? false,
        );

        // Notification pour l'admin
        await this.notificationsService.createAdminNotificationForDeactivation(
          adminId,
          medecinName,
          medecin.specialite || 'Non spécifiée',
        );
      }
    }

    return updated;
  }

  // DELETE /admin/medecins/:id
  async deleteMedecin(medecinId: string) {
    const medecin = await this.prisma.user.findUnique({
      where: { id: medecinId },
    });

    if (!medecin || medecin.role !== Role.MEDECIN) {
      throw new NotFoundException('Médecin non trouvé');
    }

    // Supprimer toutes les données liées au médecin
    await this.prisma.$transaction(async (prisma) => {
      // Supprimer les notifications du médecin
      await prisma.notification.deleteMany({
        where: { userId: medecinId },
      });

      // Supprimer les créneaux horaires du médecin
      await prisma.timeSlot.deleteMany({
        where: { medecinId },
      });

      // Supprimer les indisponibilités du médecin
      await prisma.medecinIndisponibilite.deleteMany({
        where: { medecinId },
      });

      // Supprimer les notes médicales créées par le médecin
      await prisma.noteMedicale.deleteMany({
        where: { medecinId },
      });

      // Supprimer les rendez-vous du médecin
      await prisma.rendezVous.deleteMany({
        where: { medecinId },
      });

      // Supprimer le médecin
      await prisma.user.delete({
        where: { id: medecinId },
      });
    });

    return {
      message: 'Médecin supprimé avec succès',
      deletedId: medecinId,
    };
  }

  // PATCH /admin/medecins/:id/approve
  async approveMedecin(medecinId: string, adminId: string) {
    const medecin = await this.prisma.user.findUnique({
      where: { id: medecinId },
    });

    if (!medecin || medecin.role !== Role.MEDECIN) {
      throw new NotFoundException('Médecin non trouvé');
    }

    if (medecin.statutValidation === StatutValidation.APPROVED) {
      throw new BadRequestException('Ce médecin est déjà approuvé');
    }

    const updated = await this.prisma.user.update({
      where: { id: medecinId },
      data: {
        statutValidation: StatutValidation.APPROVED,
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

    // Envoyer les notifications en arrière-plan (non-bloquant)
    setImmediate(async () => {
      try {
        // Envoyer une notification complète au médecin (base de données + email + SMS)
        await this.notificationsService.sendAccountApproval(
          updated.id,
          `${updated.prenom} ${updated.nom}`,
          updated.email,
          updated.telephone || '',
          updated.preferencesNotifEmail ?? true,
          updated.preferencesNotifSms ?? false,
        );

        // Créer une notification pour l'admin
        await this.notificationsService.createAdminNotificationForApproval(
          adminId,
          `${updated.prenom} ${updated.nom}`,
          updated.specialite || 'Non spécifiée',
        );
      } catch (error) {
        console.error('Erreur lors de l\'envoi des notifications d\'approbation:', error);
      }
    });

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

  // PATCH /admin/medecins/:id/reject
  async rejectMedecin(medecinId: string, adminId: string) {
    const medecin = await this.prisma.user.findUnique({
      where: { id: medecinId },
    });

    if (!medecin || medecin.role !== Role.MEDECIN) {
      throw new NotFoundException('Médecin non trouvé');
    }

    if (medecin.statutValidation === StatutValidation.REJECTED) {
      throw new BadRequestException('Ce médecin est déjà rejeté');
    }

    const updated = await this.prisma.user.update({
      where: { id: medecinId },
      data: {
        statutValidation: StatutValidation.REJECTED,
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

    // Envoyer les notifications en arrière-plan (non-bloquant)
    setImmediate(async () => {
      try {
        // Envoyer une notification complète au médecin (base de données + email + SMS)
        await this.notificationsService.sendAccountRejection(
          updated.id,
          `${updated.prenom} ${updated.nom}`,
          updated.email,
          updated.telephone || '',
          updated.preferencesNotifEmail ?? true,
          updated.preferencesNotifSms ?? false,
        );

        // Créer une notification pour l'admin
        await this.notificationsService.createAdminNotificationForRejection(
          adminId,
          `${updated.prenom} ${updated.nom}`,
          updated.specialite || 'Non spécifiée',
        );
      } catch (error) {
        console.error('Erreur lors de l\'envoi des notifications de rejet:', error);
      }
    });

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

  // GET /admin/rendezvous
  async getRendezVous(filters?: {
    statut?: StatutRendezVous;
    patientId?: string;
    medecinId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

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

  // PATCH /admin/rendezvous/:id
  async updateRendezVous(rendezVousId: string, updateRendezVousDto: UpdateRendezVousDto) {
    const rendezvous = await this.prisma.rendezVous.findUnique({
      where: { id: rendezVousId },
    });

    if (!rendezvous) {
      throw new NotFoundException('Rendez-vous non trouvé');
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

  // GET /admin/notifications
  async getNotifications(
    userId: string,
    filters?: { lue?: boolean; page?: number; limit?: number },
  ) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
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

  // PATCH /admin/notifications/mark-as-read
  async markNotificationsAsRead(userId: string, notificationIds?: string[]) {
    const where: any = {
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

  // GET /admin/statistiques
  async getStatistics() {
    const [
      totalPatients,
      activePatients,
      totalMedecins,
      activeMedecins,
      totalRendezVous,
      rendezVousParStatut,
      rendezVousParMedecin,
      rendezVousParSpecialite,
    ] = await Promise.all([
      // Total patients
      this.prisma.user.count({ where: { role: Role.PATIENT } }),

      // Patients actifs
      this.prisma.user.count({ where: { role: Role.PATIENT, isActive: true } }),

      // Total médecins
      this.prisma.user.count({ where: { role: Role.MEDECIN } }),

      // Médecins actifs
      this.prisma.user.count({ where: { role: Role.MEDECIN, isActive: true } }),

      // Total rendez-vous
      this.prisma.rendezVous.count(),

      // Rendez-vous par statut
      this.prisma.rendezVous.groupBy({
        by: ['statut'],
        _count: true,
      }),

      // Rendez-vous par médecin (top 10)
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

      // Rendez-vous par spécialité
      this.prisma.$queryRaw`
        SELECT u.specialite, COUNT(r.id)::int as count
        FROM "RendezVous" r
        JOIN "User" u ON r."medecinId" = u.id
        WHERE u.specialite IS NOT NULL
        GROUP BY u.specialite
        ORDER BY count DESC
      `,
    ]);

    // Calculer le taux d'annulation
    const rdvAnnules = rendezVousParStatut.find((s) => s.statut === StatutRendezVous.ANNULE);
    const tauxAnnulation = totalRendezVous > 0
      ? ((rdvAnnules?._count || 0) / totalRendezVous) * 100
      : 0;

    // Récupérer les détails des médecins pour rendezVousParMedecin
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

  // GET /admin/profile
  async getProfile(userId: string) {
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

    if (!user || user.role !== Role.ADMIN) {
      throw new NotFoundException('Administrateur non trouvé');
    }

    return user;
  }

  // PATCH /admin/profile
  async updateProfile(userId: string, updateData: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== Role.ADMIN) {
      throw new NotFoundException('Administrateur non trouvé');
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

  // GET /admin/audit-logs
  async getAuditLogs(filters?: {
    limit?: number;
    page?: number;
    status?: string;
  }) {
    const limit = filters?.limit || 20;
    const page = filters?.page || 1;
    const skip = (page - 1) * limit;

    // Construire les conditions de filtrage
    const where: any = {};

    if (filters?.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    // Récupérer les logs depuis la base de données
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

    // Formater les logs pour correspondre au format attendu par le frontend
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
}
