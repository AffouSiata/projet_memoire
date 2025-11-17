"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("./email.service");
const sms_service_1 = require("./sms.service");
const client_1 = require("@prisma/client");
let NotificationsService = class NotificationsService {
    prisma;
    emailService;
    smsService;
    constructor(prisma, emailService, smsService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.smsService = smsService;
    }
    async createNotification(userId, type, titre, description) {
        return this.prisma.notification.create({
            data: {
                userId,
                type,
                titre,
                description,
            },
        });
    }
    async sendAppointmentConfirmation(userId, patientName, patientEmail, patientPhone, medecinName, date, motif, sendEmail, sendSms) {
        await this.createNotification(userId, client_1.TypeNotification.CONFIRMATION, 'Rendez-vous confirmé', `Votre rendez-vous avec Dr. ${medecinName} est confirmé pour le ${new Date(date).toLocaleDateString('fr-FR')}.`);
        if (sendEmail) {
            await this.emailService.sendAppointmentConfirmation(patientEmail, patientName, medecinName, date, motif);
        }
        if (sendSms) {
            await this.smsService.sendAppointmentConfirmation(patientPhone, patientName, medecinName, date);
        }
    }
    async sendAppointmentCancellation(userId, patientName, patientEmail, patientPhone, medecinName, date, sendEmail, sendSms) {
        await this.createNotification(userId, client_1.TypeNotification.ANNULATION, 'Rendez-vous annulé', `Votre rendez-vous avec Dr. ${medecinName} du ${new Date(date).toLocaleDateString('fr-FR')} a été annulé.`);
        if (sendEmail) {
            await this.emailService.sendAppointmentCancellation(patientEmail, patientName, medecinName, date);
        }
        if (sendSms) {
            await this.smsService.sendAppointmentCancellation(patientPhone, patientName, medecinName, date);
        }
    }
    async sendAppointmentReminder(userId, patientName, patientEmail, patientPhone, medecinName, date, sendEmail, sendSms) {
        await this.createNotification(userId, client_1.TypeNotification.RAPPEL, 'Rappel de rendez-vous', `Rappel: Rendez-vous avec Dr. ${medecinName} le ${new Date(date).toLocaleDateString('fr-FR')}.`);
        if (sendEmail) {
            await this.emailService.sendAppointmentReminder(patientEmail, patientName, medecinName, date);
        }
        if (sendSms) {
            await this.smsService.sendAppointmentReminder(patientPhone, patientName, medecinName, date);
        }
    }
    async sendAppointmentReschedule(userId, patientName, patientEmail, patientPhone, medecinName, oldDate, newDate, sendEmail, sendSms) {
        await this.createNotification(userId, client_1.TypeNotification.CHANGEMENT_HORAIRE, 'Changement d\'horaire', `Votre rendez-vous avec Dr. ${medecinName} a été déplacé du ${new Date(oldDate).toLocaleDateString('fr-FR')} au ${new Date(newDate).toLocaleDateString('fr-FR')}.`);
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
        if (sendSms) {
            const message = `Votre RDV avec Dr. ${medecinName} a été déplacé du ${new Date(oldDate).toLocaleDateString('fr-FR')} au ${new Date(newDate).toLocaleDateString('fr-FR')}.`;
            await this.smsService.sendSms(patientPhone, message);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        sms_service_1.SmsService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map