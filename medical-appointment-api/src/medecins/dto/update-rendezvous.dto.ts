import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { StatutRendezVous } from '@prisma/client';

export class UpdateRendezVousDto {
  @IsOptional()
  @IsEnum(StatutRendezVous)
  statut?: StatutRendezVous;

  @IsOptional()
  @IsDateString()
  date?: string;
}
