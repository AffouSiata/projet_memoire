import { Role } from '@prisma/client';
export declare class RegisterDto {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    role: Role;
    telephone: string;
    dateNaissance?: string;
    adresse?: string;
    specialite?: string;
    numeroOrdre?: string;
}
