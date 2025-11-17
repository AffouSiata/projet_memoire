import { PatientsService } from './patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { CreateRendezVousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezVousStatusDto } from './dto/update-rendezvous-status.dto';
import { StatutRendezVous } from '@prisma/client';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    getProfile(user: any): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        telephone: string;
        dateNaissance: Date | null;
        adresse: string | null;
        createdAt: Date;
        preferencesNotifEmail: boolean;
        preferencesNotifSms: boolean;
        preferencesNotifPush: boolean;
        preferencesRappels: boolean;
        preferencesPromotions: boolean;
        theme: import("@prisma/client").$Enums.Theme;
        couleurAccent: string;
        langue: string;
        twoFactorAuth: boolean;
        biometricAuth: boolean;
    }>;
    updateProfile(user: any, updatePatientDto: UpdatePatientDto): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        telephone: string;
        dateNaissance: Date | null;
        adresse: string | null;
    }>;
    updatePassword(user: any, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    getRendezVous(user: any, statut?: StatutRendezVous, medecinId?: string, type?: 'passe' | 'futur' | 'all', page?: number, limit?: number): Promise<{
        data: ({
            medecin: {
                id: string;
                nom: string;
                prenom: string;
                specialite: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            medecinId: string;
            date: Date;
            motif: string;
            statut: import("@prisma/client").$Enums.StatutRendezVous;
            patientId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createRendezVous(user: any, createRendezVousDto: CreateRendezVousDto): Promise<{
        medecin: {
            id: string;
            nom: string;
            prenom: string;
            specialite: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        date: Date;
        motif: string;
        statut: import("@prisma/client").$Enums.StatutRendezVous;
        patientId: string;
    }>;
    updateRendezVousStatus(user: any, id: string, updateRendezVousStatusDto: UpdateRendezVousStatusDto): Promise<{
        success: boolean;
        message: string;
        data: {
            patient: {
                id: string;
                email: string;
                nom: string;
                prenom: string;
                motDePasse: string;
                role: import("@prisma/client").$Enums.Role;
                telephone: string;
                dateNaissance: Date | null;
                adresse: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                preferencesNotifEmail: boolean;
                preferencesNotifSms: boolean;
                preferencesNotifPush: boolean;
                preferencesRappels: boolean;
                preferencesPromotions: boolean;
                theme: import("@prisma/client").$Enums.Theme;
                couleurAccent: string;
                langue: string;
                twoFactorAuth: boolean;
                biometricAuth: boolean;
                specialite: string | null;
                numeroOrdre: string | null;
                statutValidation: import("@prisma/client").$Enums.StatutValidation | null;
                refreshToken: string | null;
            };
            medecin: {
                id: string;
                email: string;
                nom: string;
                prenom: string;
                motDePasse: string;
                role: import("@prisma/client").$Enums.Role;
                telephone: string;
                dateNaissance: Date | null;
                adresse: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                preferencesNotifEmail: boolean;
                preferencesNotifSms: boolean;
                preferencesNotifPush: boolean;
                preferencesRappels: boolean;
                preferencesPromotions: boolean;
                theme: import("@prisma/client").$Enums.Theme;
                couleurAccent: string;
                langue: string;
                twoFactorAuth: boolean;
                biometricAuth: boolean;
                specialite: string | null;
                numeroOrdre: string | null;
                statutValidation: import("@prisma/client").$Enums.StatutValidation | null;
                refreshToken: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            medecinId: string;
            date: Date;
            motif: string;
            statut: import("@prisma/client").$Enums.StatutRendezVous;
            patientId: string;
        };
    }>;
    getNotifications(user: any, lue?: boolean, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            type: import("@prisma/client").$Enums.TypeNotification;
            titre: string;
            description: string;
            lue: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markNotificationsAsRead(user: any, body?: {
        notificationIds?: string[];
    }): Promise<{
        message: string;
    }>;
    updatePreferences(user: any, updatePreferencesDto: UpdatePreferencesDto): Promise<{
        preferencesNotifEmail: boolean;
        preferencesNotifSms: boolean;
        preferencesNotifPush: boolean;
        preferencesRappels: boolean;
        preferencesPromotions: boolean;
        theme: import("@prisma/client").$Enums.Theme;
        couleurAccent: string;
        langue: string;
        twoFactorAuth: boolean;
        biometricAuth: boolean;
    }>;
    getMedecins(specialite?: string): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        specialite: string | null;
    }[]>;
}
