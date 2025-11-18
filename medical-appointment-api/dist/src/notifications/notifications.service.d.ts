import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { TypeNotification } from '@prisma/client';
export declare class NotificationsService {
    private prisma;
    private emailService;
    private smsService;
    constructor(prisma: PrismaService, emailService: EmailService, smsService: SmsService);
    createNotification(userId: string, type: TypeNotification, titre: string, description: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.TypeNotification;
        titre: string;
        description: string;
        lue: boolean;
    }>;
    sendAppointmentConfirmation(userId: string, patientName: string, patientEmail: string, patientPhone: string, medecinName: string, date: Date, motif: string, sendEmail: boolean, sendSms: boolean): Promise<void>;
    sendAppointmentCancellation(userId: string, patientName: string, patientEmail: string, patientPhone: string, medecinName: string, date: Date, sendEmail: boolean, sendSms: boolean): Promise<void>;
    sendAppointmentReminder(userId: string, patientName: string, patientEmail: string, patientPhone: string, medecinName: string, date: Date, sendEmail: boolean, sendSms: boolean): Promise<void>;
    sendAppointmentReschedule(userId: string, patientName: string, patientEmail: string, patientPhone: string, medecinName: string, oldDate: Date, newDate: Date, sendEmail: boolean, sendSms: boolean): Promise<void>;
    sendAccountApproval(userId: string, medecinName: string, medecinEmail: string, medecinPhone: string, sendEmail: boolean, sendSms: boolean): Promise<void>;
    sendAccountRejection(userId: string, medecinName: string, medecinEmail: string, medecinPhone: string, sendEmail: boolean, sendSms: boolean): Promise<void>;
    createAdminNotificationForApproval(adminId: string, medecinName: string, specialite: string): Promise<void>;
    createAdminNotificationForRejection(adminId: string, medecinName: string, specialite: string): Promise<void>;
    sendAccountDeactivation(userId: string, medecinName: string, medecinEmail: string, medecinPhone: string, sendEmail: boolean, sendSms: boolean): Promise<void>;
    sendAccountActivation(userId: string, medecinName: string, medecinEmail: string, medecinPhone: string, sendEmail: boolean, sendSms: boolean): Promise<void>;
    createAdminNotificationForDeactivation(adminId: string, medecinName: string, specialite: string): Promise<void>;
    createAdminNotificationForActivation(adminId: string, medecinName: string, specialite: string): Promise<void>;
}
