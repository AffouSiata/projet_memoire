import { IsBoolean, IsOptional, IsEnum, IsString } from 'class-validator';
import { Theme } from '@prisma/client';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  preferencesNotifEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  preferencesNotifSms?: boolean;

  @IsOptional()
  @IsBoolean()
  preferencesNotifPush?: boolean;

  @IsOptional()
  @IsBoolean()
  preferencesRappels?: boolean;

  @IsOptional()
  @IsBoolean()
  preferencesPromotions?: boolean;

  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsString()
  couleurAccent?: string;

  @IsOptional()
  @IsString()
  langue?: string;

  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;

  @IsOptional()
  @IsBoolean()
  biometricAuth?: boolean;
}
