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

  // Envoyer une notification d'approbation de compte médecin
  async sendAccountApproval(
    userId: string,
    medecinName: string,
    medecinEmail: string,
    medecinPhone: string,
    sendEmail: boolean,
    sendSms: boolean,
  ) {
    // Créer la notification en base
    await this.createNotification(
      userId,
      TypeNotification.CONFIRMATION,
      'Compte approuvé',
      `Félicitations Dr. ${medecinName}! Votre compte a été approuvé par l'administration. Vous pouvez maintenant vous connecter et accéder à votre espace médecin.`,
    );

    // Envoyer email si activé
    if (sendEmail) {
      await this.emailService.sendAccountApproval(medecinEmail, medecinName);
    }

    // Envoyer SMS si activé
    if (sendSms) {
      const message = `Félicitations Dr. ${medecinName}! Votre compte médecin a été approuvé. Vous pouvez maintenant vous connecter.`;
      await this.smsService.sendSms(medecinPhone, message);
    }
  }

  // Envoyer une notification de rejet de compte médecin
  async sendAccountRejection(
    userId: string,
    medecinName: string,
    medecinEmail: string,
    medecinPhone: string,
    sendEmail: boolean,
    sendSms: boolean,
  ) {
    // Créer la notification en base
    await this.createNotification(
      userId,
      TypeNotification.ANNULATION,
      'Demande refusée',
      `Bonjour Dr. ${medecinName}, nous regrettons de vous informer que votre demande d'inscription a été refusée. Pour plus d'informations, veuillez contacter l'administration.`,
    );

    // Envoyer email si activé
    if (sendEmail) {
      await this.emailService.sendAccountRejection(medecinEmail, medecinName);
    }

    // Envoyer SMS si activé
    if (sendSms) {
      const message = `Dr. ${medecinName}, votre demande d'inscription a été refusée. Contactez l'administration pour plus d'informations.`;
      await this.smsService.sendSms(medecinPhone, message);
    }
  }

  // Créer une notification pour l'admin lors de l'approbation d'un médecin
  async createAdminNotificationForApproval(
    adminId: string,
    medecinName: string,
    specialite: string,
  ) {
    await this.createNotification(
      adminId,
      TypeNotification.CONFIRMATION,
      'Médecin approuvé',
      `Vous avez approuvé le compte de Dr. ${medecinName} (${specialite}). Le médecin a reçu un email de confirmation.`,
    );
  }

  // Créer une notification pour l'admin lors du rejet d'un médecin
  async createAdminNotificationForRejection(
    adminId: string,
    medecinName: string,
    specialite: string,
  ) {
    await this.createNotification(
      adminId,
      TypeNotification.ANNULATION,
      'Demande rejetée',
      `Vous avez rejeté la demande d'inscription de Dr. ${medecinName} (${specialite}). Le médecin a été notifié.`,
    );
  }

  // Envoyer une notification de désactivation de compte médecin
  async sendAccountDeactivation(
    userId: string,
    medecinName: string,
    medecinEmail: string,
    medecinPhone: string,
    sendEmail: boolean,
    sendSms: boolean,
  ) {
    // Créer la notification en base
    await this.createNotification(
      userId,
      TypeNotification.ANNULATION,
      'Compte désactivé',
      `Bonjour Dr. ${medecinName}, votre compte a été désactivé par l'administration. Pour plus d'informations, veuillez contacter l'administration.`,
    );

    // Envoyer email si activé
    if (sendEmail) {
      const subject = 'Compte désactivé';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Compte désactivé</h2>
          <p>Bonjour Dr. ${medecinName},</p>
          <p>Nous vous informons que votre compte a été désactivé par l'administration.</p>
          <p>Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez plus d'informations, veuillez contacter l'administration.</p>
          <p>Cordialement,<br>L'équipe médicale</p>
        </div>
      `;
      await this.emailService.sendEmail(medecinEmail, subject, html);
    }

    // Envoyer SMS si activé
    if (sendSms && medecinPhone) {
      const message = `Dr. ${medecinName}, votre compte a été désactivé par l'administration. Contactez-nous pour plus d'informations.`;
      await this.smsService.sendSms(medecinPhone, message);
    }
  }

  // Envoyer une notification de réactivation de compte médecin
  async sendAccountActivation(
    userId: string,
    medecinName: string,
    medecinEmail: string,
    medecinPhone: string,
    sendEmail: boolean,
    sendSms: boolean,
  ) {
    // Créer la notification en base
    await this.createNotification(
      userId,
      TypeNotification.CONFIRMATION,
      'Compte activé',
      `Félicitations Dr. ${medecinName}! Votre compte a été réactivé par l'administration. Vous pouvez maintenant vous connecter et accéder à votre espace médecin.`,
    );

    // Envoyer email si activé
    if (sendEmail) {
      const subject = 'Compte réactivé';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Compte réactivé</h2>
          <p>Bonjour Dr. ${medecinName},</p>
          <p>Nous sommes heureux de vous informer que votre compte a été réactivé par l'administration.</p>
          <p>Vous pouvez maintenant vous connecter et accéder à votre espace médecin.</p>
          <p>Cordialement,<br>L'équipe médicale</p>
        </div>
      `;
      await this.emailService.sendEmail(medecinEmail, subject, html);
    }

    // Envoyer SMS si activé
    if (sendSms && medecinPhone) {
      const message = `Dr. ${medecinName}, votre compte a été réactivé. Vous pouvez maintenant vous connecter.`;
      await this.smsService.sendSms(medecinPhone, message);
    }
  }

  // Créer une notification pour l'admin lors de la désactivation d'un médecin
  async createAdminNotificationForDeactivation(
    adminId: string,
    medecinName: string,
    specialite: string,
  ) {
    await this.createNotification(
      adminId,
      TypeNotification.ANNULATION,
      'Compte médecin désactivé',
      `Vous avez désactivé le compte de Dr. ${medecinName} (${specialite}). Le médecin a été notifié par email.`,
    );
  }

  // Créer une notification pour l'admin lors de l'activation d'un médecin
  async createAdminNotificationForActivation(
    adminId: string,
    medecinName: string,
    specialite: string,
  ) {
    await this.createNotification(
      adminId,
      TypeNotification.CONFIRMATION,
      'Compte médecin activé',
      `Vous avez activé le compte de Dr. ${medecinName} (${specialite}). Le médecin a été notifié par email.`,
    );
  }
}
