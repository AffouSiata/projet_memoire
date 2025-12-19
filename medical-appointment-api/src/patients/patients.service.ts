import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { CreateRendezVousDto } from './dto/create-rendezvous.dto';
import { NotificationsService } from '../notifications/notifications.service';
import * as bcrypt from 'bcrypt';
import { StatutRendezVous } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // GET /patients/me
  async getProfile(userId: string) {
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
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  // PATCH /patients/me
  async updateProfile(userId: string, updatePatientDto: UpdatePatientDto) {
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

  // PATCH /patients/me/password
  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const passwordMatch = await bcrypt.compare(
      updatePasswordDto.ancienMotDePasse,
      user.motDePasse,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(
      updatePasswordDto.nouveauMotDePasse,
      10,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { motDePasse: hashedPassword },
    });

    return { message: 'Mot de passe mis à jour avec succès' };
  }

  // GET /patients/rendezvous
  async getRendezVous(
    userId: string,
    filters?: {
      statut?: StatutRendezVous;
      medecinId?: string;
      type?: 'passe' | 'futur' | 'all';
      page?: number;
      limit?: number;
    },
  ) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
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
    } else if (filters?.type === 'futur') {
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

  // POST /patients/rendezvous
  async createRendezVous(userId: string, createRendezVousDto: CreateRendezVousDto) {
    // Récupérer les informations du patient avec ses préférences
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
      throw new NotFoundException('Patient non trouvé');
    }

    // Vérifier si le médecin existe
    const medecin = await this.prisma.user.findUnique({
      where: { id: createRendezVousDto.medecinId },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        preferencesNotifEmail: true,
      },
    });

    if (!medecin || medecin.role !== 'MEDECIN') {
      throw new BadRequestException('Médecin non trouvé');
    }

    // Vérifier si la date est dans le futur
    const appointmentDate = new Date(createRendezVousDto.date);
    if (appointmentDate < new Date()) {
      throw new BadRequestException('La date doit être dans le futur');
    }

    // Vérifier si le médecin est disponible à cette date
    const existingAppointment = await this.prisma.rendezVous.findFirst({
      where: {
        medecinId: createRendezVousDto.medecinId,
        date: appointmentDate,
        statut: {
          in: [StatutRendezVous.CONFIRME, StatutRendezVous.EN_ATTENTE],
        },
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('Créneau déjà réservé');
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

    // Créer une notification pour le patient
    try {
      await this.notificationsService.createNotification(
        patient.id,
        'CONFIRMATION',
        'Demande de rendez-vous reçue',
        `Votre demande de rendez-vous avec Dr. ${medecin.prenom} ${medecin.nom} pour le ${appointmentDate.toLocaleDateString('fr-FR')} a été reçue et est en attente de confirmation.`,
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification au patient:', error);
    }

    // Envoyer une notification et un email au médecin
    try {
      await this.notificationsService.sendNewAppointmentRequestToDoctor(
        medecin.id,
        medecin.email,
        `${medecin.prenom} ${medecin.nom}`,
        `${patient.prenom} ${patient.nom}`,
        appointmentDate,
        createRendezVousDto.motif,
        medecin.preferencesNotifEmail ?? true,
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification au médecin:', error);
    }

    return rendezvous;
  }

  // GET /patients/notifications
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

  // PATCH /patients/notifications/mark-as-read
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

  // PATCH /patients/preferences
  async updatePreferences(
    userId: string,
    updatePreferencesDto: UpdatePreferencesDto,
  ) {
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

  // GET /patients/medecins
  async getMedecins(specialite?: string) {
    const where: any = {
      role: 'MEDECIN',
      statutValidation: 'APPROVED', // Seulement les médecins approuvés
      isActive: true, // Seulement les médecins actifs
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

  // PATCH /patients/rendezvous/:id
  async updateRendezVousStatus(
    userId: string,
    rendezvousId: string,
    statut: StatutRendezVous,
  ) {
    // RESTRICTION: Le patient ne peut QUE annuler son rendez-vous, pas le confirmer
    if (statut !== StatutRendezVous.ANNULE) {
      throw new BadRequestException(
        'Les patients ne peuvent qu\'annuler leurs rendez-vous. Seul le médecin peut confirmer un rendez-vous.',
      );
    }

    // Vérifier que le rendez-vous appartient au patient
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
      throw new NotFoundException('Rendez-vous non trouvé');
    }

    // Vérifier que le rendez-vous n'est pas déjà annulé
    if (rendezvous.statut === StatutRendezVous.ANNULE) {
      throw new BadRequestException('Ce rendez-vous est déjà annulé');
    }

    // Mettre à jour le statut
    const updatedRendezVous = await this.prisma.rendezVous.update({
      where: { id: rendezvousId },
      data: { statut },
      include: {
        medecin: true,
        patient: true,
      },
    });

    // Envoyer notification au médecin (seulement pour annulation car patient ne peut que annuler)
    await this.notificationsService.createNotification(
      rendezvous.medecinId,
      'ANNULATION',
      'Rendez-vous annulé',
      `Le patient ${rendezvous.patient.prenom} ${rendezvous.patient.nom} a annulé son rendez-vous du ${new Date(rendezvous.date).toLocaleDateString('fr-FR')}`,
    );

    // Envoyer email et SMS au patient pour confirmer l'annulation
    try {
      await this.notificationsService.sendAppointmentCancellation(
        rendezvous.patient.id,
        `${rendezvous.patient.prenom} ${rendezvous.patient.nom}`,
        rendezvous.patient.email,
        rendezvous.patient.telephone || '',
        `${rendezvous.medecin.prenom} ${rendezvous.medecin.nom}`,
        rendezvous.date,
        rendezvous.patient.preferencesNotifEmail ?? true,
        rendezvous.patient.preferencesNotifSms ?? false,
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification d\'annulation au patient:', error);
    }

    return {
      success: true,
      message: 'Rendez-vous annulé avec succès',
      data: updatedRendezVous,
    };
  }
}
