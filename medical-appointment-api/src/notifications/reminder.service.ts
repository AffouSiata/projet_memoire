import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { StatutRendezVous } from '@prisma/client';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Cron job qui s'exécute tous les jours à 8h00
   * Envoie des rappels pour les RDV du lendemain
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDailyReminders() {
    this.logger.log('Démarrage de l\'envoi des rappels quotidiens...');

    try {
      // Calculer la plage de dates pour demain
      const now = new Date();
      const tomorrowStart = new Date(now);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(tomorrowStart);
      tomorrowEnd.setHours(23, 59, 59, 999);

      // Trouver tous les RDV confirmés pour demain
      const appointments = await this.prisma.rendezVous.findMany({
        where: {
          date: {
            gte: tomorrowStart,
            lte: tomorrowEnd,
          },
          statut: StatutRendezVous.CONFIRME,
        },
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
              preferencesRappels: true,
            },
          },
          medecin: {
            select: {
              nom: true,
              prenom: true,
            },
          },
        },
      });

      this.logger.log(`${appointments.length} rendez-vous trouvés pour demain`);

      let sentCount = 0;
      let skippedCount = 0;

      for (const appointment of appointments) {
        // Vérifier si le patient a activé les rappels
        if (appointment.patient.preferencesRappels === false) {
          this.logger.debug(
            `Rappel ignoré pour ${appointment.patient.prenom} ${appointment.patient.nom} (préférence désactivée)`,
          );
          skippedCount++;
          continue;
        }

        try {
          await this.notificationsService.sendAppointmentReminder(
            appointment.patient.id,
            `${appointment.patient.prenom} ${appointment.patient.nom}`,
            appointment.patient.email,
            appointment.patient.telephone || '',
            `${appointment.medecin.prenom} ${appointment.medecin.nom}`,
            appointment.date,
            appointment.patient.preferencesNotifEmail ?? true,
            appointment.patient.preferencesNotifSms ?? false,
          );

          sentCount++;
          this.logger.debug(
            `Rappel envoyé à ${appointment.patient.prenom} ${appointment.patient.nom}`,
          );
        } catch (error) {
          this.logger.error(
            `Erreur lors de l'envoi du rappel à ${appointment.patient.email}:`,
            error,
          );
        }
      }

      this.logger.log(
        `Rappels terminés: ${sentCount} envoyés, ${skippedCount} ignorés`,
      );
    } catch (error) {
      this.logger.error('Erreur lors de l\'envoi des rappels:', error);
    }
  }

  /**
   * Méthode pour envoyer un rappel manuellement (pour les tests)
   */
  async sendReminderForAppointment(appointmentId: string) {
    const appointment = await this.prisma.rendezVous.findUnique({
      where: { id: appointmentId },
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
            preferencesRappels: true,
          },
        },
        medecin: {
          select: {
            nom: true,
            prenom: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    if (appointment.patient.preferencesRappels === false) {
      return { message: 'Rappels désactivés pour ce patient' };
    }

    await this.notificationsService.sendAppointmentReminder(
      appointment.patient.id,
      `${appointment.patient.prenom} ${appointment.patient.nom}`,
      appointment.patient.email,
      appointment.patient.telephone || '',
      `${appointment.medecin.prenom} ${appointment.medecin.nom}`,
      appointment.date,
      appointment.patient.preferencesNotifEmail ?? true,
      appointment.patient.preferencesNotifSms ?? false,
    );

    return { message: 'Rappel envoyé avec succès' };
  }

  /**
   * Méthode pour déclencher manuellement les rappels (pour les tests)
   */
  async triggerReminders() {
    await this.sendDailyReminders();
    return { message: 'Rappels déclenchés manuellement' };
  }
}
