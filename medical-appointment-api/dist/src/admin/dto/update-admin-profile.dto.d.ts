import { Theme } from '@prisma/client';
export declare class UpdateAdminProfileDto {
    preferencesNotifEmail?: boolean;
    preferencesNotifSms?: boolean;
    theme?: Theme;
    langue?: string;
    twoFactorAuth?: boolean;
}
