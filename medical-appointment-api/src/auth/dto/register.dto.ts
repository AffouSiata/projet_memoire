import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  motDePasse: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  telephone: string;

  @IsOptional()
  @IsDateString()
  dateNaissance?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  // Champs spécifiques pour médecin
  @IsOptional()
  @IsString()
  specialite?: string;

  @IsOptional()
  @IsString()
  numeroOrdre?: string; // Numéro d'ordre des médecins pour vérification
}
