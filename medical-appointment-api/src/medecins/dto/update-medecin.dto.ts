import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Theme } from '@prisma/client';

export class UpdateMedecinDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  specialite?: string;

  @IsOptional()
  @IsString()
  langue?: string;

  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsBoolean()
  preferencesNotifEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  preferencesNotifSms?: boolean;

  @IsOptional()
  @IsBoolean()
  preferencesRappelRdv?: boolean;
}
