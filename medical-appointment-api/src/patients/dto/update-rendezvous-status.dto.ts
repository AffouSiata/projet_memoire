import { IsEnum } from 'class-validator';
import { StatutRendezVous } from '@prisma/client';

export class UpdateRendezVousStatusDto {
  @IsEnum(StatutRendezVous)
  statut: StatutRendezVous;
}
