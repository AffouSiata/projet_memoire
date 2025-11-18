import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMedecinDto } from './dto/update-medecin.dto';
import { UpdateRendezVousDto } from './dto/update-rendezvous.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateIndisponibiliteDto } from './dto/create-indisponibilite.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { StatutRendezVous, StatutNote } from '@prisma/client';

@Injectable()
export class MedecinsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // GET /medecins/me
  async getProfile(userId: string) {
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
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  // PATCH /medecins/me
  async updateProfile(userId: string, updateMedecinDto: UpdateMedecinDto) {
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

  // GET /medecins/rendezvous
  async getRendezVous(
    userId: string,
    filters?: {
      statut?: StatutRendezVous;
      patientId?: string;
      type?: 'passe' | 'futur' | 'all';
      page?: number;
      limit?: number;
    },
  ) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
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
    } else if (filters?.type === 'futur') {
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

  // PATCH /medecins/rendezvous/:id
  async updateRendezVous(
    userId: string,
    rendezVousId: string,
    updateRendezVousDto: UpdateRendezVousDto,
  ) {
    // Vérifier que le rendez-vous appartient au médecin
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
      throw new NotFoundException('Rendez-vous non trouvé');
    }

    if (rendezvous.medecinId !== userId) {
      throw new ForbiddenException('Accès interdit');
    }

    // Récupérer les informations du médecin
    const medecin = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        nom: true,
        prenom: true,
      },
    });

    if (!medecin) {
      throw new NotFoundException('Médecin non trouvé');
    }

    // Si on change la date, vérifier qu'elle est dans le futur
    if (updateRendezVousDto.date) {
      const newDate = new Date(updateRendezVousDto.date);
      if (newDate < new Date()) {
        throw new BadRequestException('La date doit être dans le futur');
      }

      // Vérifier la disponibilité
      const existingAppointment = await this.prisma.rendezVous.findFirst({
        where: {
          medecinId: userId,
          date: newDate,
          id: { not: rendezVousId },
          statut: {
            in: [StatutRendezVous.CONFIRME, StatutRendezVous.EN_ATTENTE],
          },
        },
      });

      if (existingAppointment) {
        throw new BadRequestException('Créneau déjà réservé');
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

    // Si le rendez-vous est confirmé, envoyer une notification de confirmation
    if (
      updateRendezVousDto.statut === StatutRendezVous.CONFIRME &&
      rendezvous.statut !== StatutRendezVous.CONFIRME
    ) {
      try {
        await this.notificationsService.sendAppointmentConfirmation(
          rendezvous.patient.id,
          `${rendezvous.patient.prenom} ${rendezvous.patient.nom}`,
          rendezvous.patient.email,
          rendezvous.patient.telephone || '',
          `${medecin.prenom} ${medecin.nom}`,
          updateRendezVousDto.date ? new Date(updateRendezVousDto.date) : rendezvous.date,
          rendezvous.motif,
          rendezvous.patient.preferencesNotifEmail ?? true,
          rendezvous.patient.preferencesNotifSms ?? false,
        );
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification de confirmation:', error);
      }
    }

    // Si le rendez-vous est annulé, envoyer une notification
    if (
      updateRendezVousDto.statut === StatutRendezVous.ANNULE &&
      rendezvous.statut !== StatutRendezVous.ANNULE
    ) {
      try {
        await this.notificationsService.sendAppointmentCancellation(
          rendezvous.patient.id,
          `${rendezvous.patient.prenom} ${rendezvous.patient.nom}`,
          rendezvous.patient.email,
          rendezvous.patient.telephone,
          `${medecin.prenom} ${medecin.nom}`,
          rendezvous.date,
          rendezvous.patient.preferencesNotifEmail, // Respecte la préférence email
          rendezvous.patient.preferencesNotifSms,   // Respecte la préférence SMS
        );
      } catch (error) {
        // Ne pas bloquer l'annulation si l'envoi de notification échoue
        console.error('Erreur lors de l\'envoi de la notification d\'annulation:', error);
      }
    }

    return updated;
  }

  // GET /medecins/patients
  async getPatients(userId: string, filters?: { page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    // Récupérer tous les patients uniques ayant eu un rendez-vous avec ce médecin
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

  // GET /medecins/notes
  async getNotes(
    userId: string,
    filters?: {
      patientId?: string;
      statut?: StatutNote;
      page?: number;
      limit?: number;
    },
  ) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
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

  // POST /medecins/notes
  async createNote(userId: string, createNoteDto: CreateNoteDto) {
    // Vérifier que le patient existe et que le médecin a déjà eu un rendez-vous avec lui
    const patient = await this.prisma.user.findUnique({
      where: { id: createNoteDto.patientId },
    });

    if (!patient || patient.role !== 'PATIENT') {
      throw new BadRequestException('Patient non trouvé');
    }

    const hasAppointment = await this.prisma.rendezVous.findFirst({
      where: {
        patientId: createNoteDto.patientId,
        medecinId: userId,
      },
    });

    if (!hasAppointment) {
      throw new ForbiddenException(
        'Vous devez avoir un rendez-vous avec ce patient pour créer une note',
      );
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

  // PATCH /medecins/notes/:id
  async updateNote(userId: string, noteId: string, updateNoteDto: UpdateNoteDto) {
    // Vérifier que la note appartient au médecin
    const note = await this.prisma.noteMedicale.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new NotFoundException('Note non trouvée');
    }

    if (note.medecinId !== userId) {
      throw new ForbiddenException('Accès interdit');
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

  // DELETE /medecins/notes/:id
  async deleteNote(userId: string, noteId: string) {
    // Vérifier que la note appartient au médecin
    const note = await this.prisma.noteMedicale.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new NotFoundException('Note non trouvée');
    }

    if (note.medecinId !== userId) {
      throw new ForbiddenException('Accès interdit');
    }

    await this.prisma.noteMedicale.delete({
      where: { id: noteId },
    });

    return { message: 'Note supprimée avec succès' };
  }

  // GET /medecins/notifications
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

  // PATCH /medecins/notifications/mark-as-read
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

  // POST /medecins/notes/:id/upload
  async uploadAttachment(
    userId: string,
    noteId: string,
    filePath: string,
  ) {
    // Vérifier que la note appartient au médecin
    const note = await this.prisma.noteMedicale.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new NotFoundException('Note non trouvée');
    }

    if (note.medecinId !== userId) {
      throw new ForbiddenException('Accès interdit');
    }

    // Ajouter le chemin du fichier au tableau piecesJointes
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

  // GET /medecins/indisponibilites
  async getIndisponibilites(
    medecinId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const where: any = {
      medecinId,
    };

    // Filter by date range if provided
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const indisponibilites = await this.prisma.medecinIndisponibilite.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return indisponibilites;
  }

  // POST /medecins/indisponibilites
  async createIndisponibilite(
    medecinId: string,
    createIndisponibiliteDto: CreateIndisponibiliteDto,
  ) {
    const date = new Date(createIndisponibiliteDto.date);

    // Vérifier que la date est dans le futur
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      throw new BadRequestException(
        'La date d\'indisponibilité doit être dans le futur',
      );
    }

    // Vérifier qu'il n'existe pas déjà une indisponibilité pour cette date
    const existing = await this.prisma.medecinIndisponibilite.findUnique({
      where: {
        medecinId_date: {
          medecinId,
          date,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Une indisponibilité existe déjà pour cette date',
      );
    }

    const indisponibilite = await this.prisma.medecinIndisponibilite.create({
      data: {
        medecinId,
        date,
        raison: createIndisponibiliteDto.raison,
      },
    });

    return indisponibilite;
  }

  // DELETE /medecins/indisponibilites/:id
  async deleteIndisponibilite(medecinId: string, indisponibiliteId: string) {
    // Vérifier que l'indisponibilité appartient au médecin
    const indisponibilite = await this.prisma.medecinIndisponibilite.findUnique({
      where: { id: indisponibiliteId },
    });

    if (!indisponibilite) {
      throw new NotFoundException('Indisponibilité non trouvée');
    }

    if (indisponibilite.medecinId !== medecinId) {
      throw new ForbiddenException('Accès interdit');
    }

    await this.prisma.medecinIndisponibilite.delete({
      where: { id: indisponibiliteId },
    });

    return { message: 'Indisponibilité supprimée avec succès' };
  }
}
