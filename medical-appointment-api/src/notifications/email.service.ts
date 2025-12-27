import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private testAccount: any = null;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

    // Vérifier si les credentials sont configurés (pas les valeurs par défaut)
    const isConfigured =
      emailUser &&
      emailPassword &&
      emailUser !== 'your-email@gmail.com' &&
      emailPassword !== 'your-app-password';

    if (!isConfigured) {
      // Utiliser Ethereal Email pour le développement/test
      this.logger.warn('Credentials email non configurés, utilisation de Ethereal Email (test)');
      try {
        this.testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: this.testAccount.user,
            pass: this.testAccount.pass,
          },
        });
        this.logger.log('='.repeat(80));
        this.logger.log('📧 SERVICE EMAIL DE TEST ACTIVÉ (Ethereal Email)');
        this.logger.log('='.repeat(80));
        this.logger.log(`User: ${this.testAccount.user}`);
        this.logger.log(`Pass: ${this.testAccount.pass}`);
        this.logger.log('Les emails seront visibles sur: https://ethereal.email');
        this.logger.log('='.repeat(80));
      } catch (error) {
        this.logger.error('Erreur lors de la création du compte Ethereal:', error.message);
      }
    } else {
      // Utiliser les credentials configurés
      const port = this.configService.get<number>('EMAIL_PORT') || 587;
      const isSecure = port === 465; // SSL pour le port 465

      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST'),
        port: port,
        secure: isSecure,
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
        // Timeout plus long pour les hébergeurs cloud
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
      this.logger.log(`Service email configuré avec les credentials SMTP (port: ${port}, secure: ${isSecure})`);
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    // Vérifier si le transporter est initialisé
    if (!this.transporter) {
      this.logger.warn(`Email non envoyé (transporter non initialisé): ${subject} -> ${to}`);
      return { success: false, error: 'Email service not initialized' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM') || 'noreply@medical.com',
        to,
        subject,
        html,
      });

      this.logger.log(`Email envoyé: ${info.messageId}`);

      // Si on utilise Ethereal Email, afficher l'URL de prévisualisation
      if (this.testAccount) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        this.logger.log('='.repeat(80));
        this.logger.log(`📨 EMAIL DE TEST ENVOYÉ`);
        this.logger.log(`Destinataire: ${to}`);
        this.logger.log(`Sujet: ${subject}`);
        this.logger.log(`Prévisualisation: ${previewUrl}`);
        this.logger.log('='.repeat(80));
      }

      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendAppointmentConfirmation(
    to: string,
    patientName: string,
    medecinName: string,
    date: Date,
    motif: string,
  ) {
    const subject = 'Confirmation de rendez-vous';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
            .button { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Confirmation de rendez-vous</h1>
            </div>
            <div class="content">
              <p>Bonjour ${patientName},</p>
              <p>Votre rendez-vous a été confirmé avec les détails suivants :</p>
              <ul>
                <li><strong>Médecin:</strong> Dr. ${medecinName}</li>
                <li><strong>Date:</strong> ${new Date(date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</li>
                <li><strong>Heure:</strong> ${new Date(date).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}</li>
                <li><strong>Motif:</strong> ${motif}</li>
              </ul>
              <p>Nous vous prions d'arriver 10 minutes avant l'heure du rendez-vous.</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendAppointmentCancellation(
    to: string,
    patientName: string,
    medecinName: string,
    date: Date,
  ) {
    const subject = 'Annulation de rendez-vous';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Annulation de rendez-vous</h1>
            </div>
            <div class="content">
              <p>Bonjour ${patientName},</p>
              <p>Nous vous informons que votre rendez-vous a été annulé :</p>
              <ul>
                <li><strong>Médecin:</strong> Dr. ${medecinName}</li>
                <li><strong>Date:</strong> ${new Date(date).toLocaleDateString('fr-FR')}</li>
                <li><strong>Heure:</strong> ${new Date(date).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}</li>
              </ul>
              <p>Pour reprendre un nouveau rendez-vous, veuillez nous contacter.</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendAppointmentReminder(
    to: string,
    patientName: string,
    medecinName: string,
    date: Date,
  ) {
    const subject = 'Rappel de rendez-vous';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Rappel de rendez-vous</h1>
            </div>
            <div class="content">
              <p>Bonjour ${patientName},</p>
              <p>Nous vous rappelons votre rendez-vous :</p>
              <ul>
                <li><strong>Médecin:</strong> Dr. ${medecinName}</li>
                <li><strong>Date:</strong> ${new Date(date).toLocaleDateString('fr-FR')}</li>
                <li><strong>Heure:</strong> ${new Date(date).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}</li>
              </ul>
              <p>N'oubliez pas d'arriver 10 minutes avant l'heure prévue.</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendAccountApproval(
    to: string,
    medecinName: string,
  ) {
    const subject = 'Votre compte médecin a été approuvé';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
            .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Félicitations !</h1>
            </div>
            <div class="content">
              <p>Bonjour Dr. ${medecinName},</p>
              <p>Nous avons le plaisir de vous informer que votre compte médecin a été <strong>approuvé</strong> par notre administration.</p>
              <p>Vous pouvez maintenant :</p>
              <ul>
                <li>Accéder à votre espace médecin</li>
                <li>Gérer vos disponibilités</li>
                <li>Consulter et confirmer vos rendez-vous</li>
                <li>Ajouter des notes médicales pour vos patients</li>
              </ul>
              <p style="margin-top: 20px;">
                <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/login" class="button">Se connecter maintenant</a>
              </p>
              <p style="margin-top: 30px;">Bienvenue dans notre plateforme de gestion des rendez-vous médicaux !</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendAccountRejection(
    to: string,
    medecinName: string,
  ) {
    const subject = 'Votre demande d\'inscription';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Demande d'inscription</h1>
            </div>
            <div class="content">
              <p>Bonjour Dr. ${medecinName},</p>
              <p>Nous regrettons de vous informer que votre demande d'inscription en tant que médecin n'a pas été approuvée.</p>
              <p>Pour plus d'informations ou pour contester cette décision, veuillez contacter notre service administratif.</p>
              <p style="margin-top: 20px;">Cordialement,<br/>L'équipe d'administration</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(to, subject, html);
  }
}
