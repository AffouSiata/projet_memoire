import { Theme } from '@prisma/client';
export declare class UpdatePreferencesDto {
    preferencesNotifEmail?: boolean;
    preferencesNotifSms?: boolean;
    preferencesNotifPush?: boolean;
    preferencesRappels?: boolean;
    preferencesPromotions?: boolean;
    theme?: Theme;
    couleurAccent?: string;
    langue?: string;
    twoFactorAuth?: boolean;
    biometricAuth?: boolean;
}
