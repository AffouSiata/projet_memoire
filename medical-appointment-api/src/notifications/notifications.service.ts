import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { TypeNotification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  // Créer une notification en base de données
  async createNotification(
    userId: string,
    type: TypeNotification,
    titre: string,
    description: string,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        titre,
        description,
      },
    });
  }

  // Envoyer une notification de rendez-vous confirmé
  async sendAppointmentConfirmation(
    userId: string,
    patientName: string,
    patientEmail: string,
    patientPhone: string,
    medecinName: string,
    date: Date,
    motif: string,
    sendEmail: boolean,
    sendSms: boolean,
  ) {
    // Créer la notification en base
    await this.createNotification(
      userId,
      TypeNotification.CONFIRMATION,
      'Rendez-vous confirmé',
      `Votre rendez-vous avec Dr. ${medecinName} est confirmé pour le ${new Date(date).toLocaleDateString('fr-FR')}.`,
    );

    // Envoyer email si activé
    if (sendEmail) {
      await this.emailService.sendAppointmentConfirmation(
        patientEmail,
        patientName,
        medecinName,
        date,
        motif,
      );
    }

    // Envoyer SMS si activé
    if (sendSms) {
      await this.smsService.sendAppointmentConfirmation(
        patientPhone,
        patientName,
        medecinName,
        date,
      );
    }
  }

  // Envoyer une notification de rendez-vous annulé
  async sendAppointmentCancellation(
    userId: string,
    patientName: string,
    patientEmail: string,
    patientPhone: string,
    medecinName: string,
    date: Date,
    sendEmail: boolean,
    sendSms: boolean,
  ) {
    // Créer la notification en base
    await this.createNotification(
      userId,
      TypeNotification.ANNULATION,
      'Rendez-vous annulé',
      `Votre rendez-vous avec Dr. ${medecinName} du ${new Date(date).toLocaleDateString('fr-FR')} a été annulé.`,
    );

    // Envoyer email si activé
    if (sendEmail) {
      await this.emailService.sendAppointmentCancellation(
        patientEmail,
        patientName,
        medecinName,
        date,
      );
    }

    // Envoyer SMS si activé
    if (sendSms) {
      await this.smsService.sendAppointmentCancellation(
        patientPhone,
        patientName,
        medecinName,
        date,
      );
    }
  }

  // Envoyer un rappel de rendez-vous
  async sendAppointmentReminder(
    userId: string,
    patientName: string,
    patientEmail: string,
    patientPhone: string,
    medecinName: string,
    date: Date,
    sendEmail: boolean,
    sendSms: boolean,
  ) {
    // Créer la notification en base
    await this.createNotification(
      userId,
      TypeNotification.RAPPEL,
      'Rappel de rendez-vous',
      `Rappel: Rendez-vous avec Dr. ${medecinName} le ${new Date(date).toLocaleDateString('fr-FR')}.`,
    );

    // Envoyer email si activé
    if (sendEmail) {
      await this.emailService.sendAppointmentReminder(
        patientEmail,
        patientName,
        medecinName,
        date,
      );
    }

    // Envoyer SMS si activé
    if (sendSms) {
      await this.smsService.sendAppointmentReminder(
        patientPhone,
        patientName,
        medecinName,
        date,
      );
    }
  }

  // Envoyer une notification de changement d'horaire
  async sendAppointmentReschedule(
    userId: string,
    patientName: string,
    patientEmail: string,
    patientPhone: string,
    medecinName: string,
    oldDate: Date,
    newDate: Date,
    sendEmail: boolean,
    sendSms: boolean,
  ) {
    // Créer la notification en base
    await this.createNotification(
      userId,
      TypeNotification.CHANGEMENT_HORAIRE,
      'Changement d\'horaire',
      `Votre rendez-vous avec Dr. ${medecinName} a été déplacé du ${new Date(oldDate).toLocaleDateString('fr-FR')} au ${new Date(newDate).toLocaleDateString('fr-FR')}.`,
    );

    // Envoyer email si activé
    if (sendEmail) {
      const subject = 'Changement d\'horaire de rendez-vous';
      const html = `
        <p>Bonjour ${patientName},</p>
        <p>Votre rendez-vous a été déplacé :</p>
        <ul>
          <li><strong>Ancienne date:</strong> ${new Date(oldDate).toLocaleDateString('fr-FR')}</li>
          <li><strong>Nouvelle date:</strong> ${new Date(newDate).toLocaleDateString('fr-FR')}</li>
          <li><strong>Médecin:</strong> Dr. ${medecinName}</li>
        </ul>
      `;
      await this.emailService.sendEmail(patientEmail, subject, html);
    }

    // Envoyer SMS si activé
    if (sendSms) {
      const message = `Votre RDV avec Dr. ${medecinName} a été déplacé du ${new Date(oldDate).toLocaleDateString('fr-FR')} au ${new Date(newDate).toLocaleDateString('fr-FR')}.`;
      await this.smsService.sendSms(patientPhone, message);
    }
  }
}
