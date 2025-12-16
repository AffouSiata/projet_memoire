import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  private readonly logger = new Logger(SmsService.name);
  private readonly from: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.from = this.configService.get<string>('TWILIO_PHONE_NUMBER') || '';

    // Only initialize Twilio if credentials are properly configured
    if (accountSid && authToken && accountSid.startsWith('AC')) {
      try {
        this.twilioClient = new Twilio(accountSid, authToken);
        this.logger.log('Twilio SMS service initialized successfully');
      } catch (error) {
        this.logger.error(`Failed to initialize Twilio: ${error.message}`);
      }
    } else {
      this.logger.warn('Twilio credentials not configured, SMS will not be sent');
    }
  }

  async sendSms(to: string, message: string) {
    if (!this.twilioClient) {
      this.logger.warn('Twilio not configured, SMS not sent');
      return { success: false, error: 'Twilio not configured' };
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.from,
        to,
      });

      this.logger.log(`SMS envoyé: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi du SMS: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendAppointmentConfirmation(
    to: string,
    patientName: string,
    medecinName: string,
    date: Date,
  ) {
    const message = `Bonjour ${patientName}, votre rendez-vous avec Dr. ${medecinName} est confirmé le ${new Date(date).toLocaleDateString('fr-FR')} à ${new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })}.`;

    return this.sendSms(to, message);
  }

  async sendAppointmentCancellation(
    to: string,
    patientName: string,
    medecinName: string,
    date: Date,
  ) {
    const message = `Bonjour ${patientName}, votre rendez-vous avec Dr. ${medecinName} du ${new Date(date).toLocaleDateString('fr-FR')} a été annulé.`;

    return this.sendSms(to, message);
  }

  async sendAppointmentReminder(
    to: string,
    patientName: string,
    medecinName: string,
    date: Date,
  ) {
    const message = `Rappel: Rendez-vous demain avec Dr. ${medecinName} le ${new Date(date).toLocaleDateString('fr-FR')} à ${new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })}.`;

    return this.sendSms(to, message);
  }
}
