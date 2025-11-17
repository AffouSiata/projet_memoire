import { IsEnum, IsString, Matches, IsBoolean, IsOptional } from 'class-validator';
import { JourSemaine } from '@prisma/client';

export class CreateTimeSlotDto {
  @IsEnum(JourSemaine)
  jour: JourSemaine;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'heureDebut doit être au format HH:mm',
  })
  heureDebut: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'heureFin doit être au format HH:mm',
  })
  heureFin: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
