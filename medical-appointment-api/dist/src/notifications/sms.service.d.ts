import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private configService;
    private twilioClient;
    private readonly logger;
    private readonly from;
    constructor(configService: ConfigService);
    sendSms(to: string, message: string): Promise<{
        success: boolean;
        sid: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        sid?: undefined;
    }>;
    sendAppointmentConfirmation(to: string, patientName: string, medecinName: string, date: Date): Promise<{
        success: boolean;
        sid: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        sid?: undefined;
    }>;
    sendAppointmentCancellation(to: string, patientName: string, medecinName: string, date: Date): Promise<{
        success: boolean;
        sid: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        sid?: undefined;
    }>;
    sendAppointmentReminder(to: string, patientName: string, medecinName: string, date: Date): Promise<{
        success: boolean;
        sid: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        sid?: undefined;
    }>;
}
