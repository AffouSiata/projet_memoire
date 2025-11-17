"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    configService;
    transporter;
    logger = new common_1.Logger(EmailService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD'),
            },
        });
    }
    async sendEmail(to, subject, html) {
        try {
            const info = await this.transporter.sendMail({
                from: this.configService.get('EMAIL_FROM'),
                to,
                subject,
                html,
            });
            this.logger.log(`Email envoyé: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            this.logger.error(`Erreur lors de l'envoi de l'email: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async sendAppointmentConfirmation(to, patientName, medecinName, date, motif) {
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
    async sendAppointmentCancellation(to, patientName, medecinName, date) {
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
    async sendAppointmentReminder(to, patientName, medecinName, date) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map