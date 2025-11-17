import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to,
        subject,
        html,
      });

      this.logger.log(`Email envoyé: ${info.messageId}`);
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
}
