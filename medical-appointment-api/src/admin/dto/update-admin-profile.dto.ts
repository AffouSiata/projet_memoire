import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Theme } from '@prisma/client';

export class UpdateAdminProfileDto {
  @IsOptional()
  @IsBoolean()
  preferencesNotifEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  preferencesNotifSms?: boolean;

  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsString()
  langue?: string;

  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;
}
