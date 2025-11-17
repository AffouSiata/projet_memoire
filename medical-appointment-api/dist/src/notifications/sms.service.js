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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_1 = require("twilio");
let SmsService = SmsService_1 = class SmsService {
    configService;
    twilioClient;
    logger = new common_1.Logger(SmsService_1.name);
    from;
    constructor(configService) {
        this.configService = configService;
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        this.from = this.configService.get('TWILIO_PHONE_NUMBER') || '';
        if (accountSid && authToken && accountSid.startsWith('AC')) {
            try {
                this.twilioClient = new twilio_1.Twilio(accountSid, authToken);
                this.logger.log('Twilio SMS service initialized successfully');
            }
            catch (error) {
                this.logger.error(`Failed to initialize Twilio: ${error.message}`);
            }
        }
        else {
            this.logger.warn('Twilio credentials not configured, SMS will not be sent');
        }
    }
    async sendSms(to, message) {
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
        }
        catch (error) {
            this.logger.error(`Erreur lors de l'envoi du SMS: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async sendAppointmentConfirmation(to, patientName, medecinName, date) {
        const message = `Bonjour ${patientName}, votre rendez-vous avec Dr. ${medecinName} est confirmé le ${new Date(date).toLocaleDateString('fr-FR')} à ${new Date(date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        })}.`;
        return this.sendSms(to, message);
    }
    async sendAppointmentCancellation(to, patientName, medecinName, date) {
        const message = `Bonjour ${patientName}, votre rendez-vous avec Dr. ${medecinName} du ${new Date(date).toLocaleDateString('fr-FR')} a été annulé.`;
        return this.sendSms(to, message);
    }
    async sendAppointmentReminder(to, patientName, medecinName, date) {
        const message = `Rappel: Rendez-vous demain avec Dr. ${medecinName} le ${new Date(date).toLocaleDateString('fr-FR')} à ${new Date(date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        })}.`;
        return this.sendSms(to, message);
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map