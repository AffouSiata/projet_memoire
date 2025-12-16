import { IsString, IsOptional, IsEnum } from 'class-validator';
import { StatutNote } from '@prisma/client';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  contenu?: string;

  @IsOptional()
  @IsEnum(StatutNote)
  statut?: StatutNote;
}
