import { IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateRendezVousDto {
  @IsUUID()
  medecinId: string;

  @IsDateString()
  date: string;

  @IsString()
  motif: string;
}
