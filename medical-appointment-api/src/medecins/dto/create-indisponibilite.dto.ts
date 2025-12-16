import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateIndisponibiliteDto {
  @IsDateString()
  date: string; // Format ISO: YYYY-MM-DD

  @IsOptional()
  @IsString()
  raison?: string; // "Congé", "Formation", "Jour férié", etc.
}
