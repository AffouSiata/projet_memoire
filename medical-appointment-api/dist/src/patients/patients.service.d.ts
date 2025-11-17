import { PrismaService } from '../prisma/prisma.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { CreateRendezVousDto } from './dto/create-rendezvous.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { StatutRendezVous } from '@prisma/client';
export declare class PatientsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getProfile(userId: string): Promise<{
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
    updateProfile(userId: string, updatePatientDto: UpdatePatientDto): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        telephone: string;
        dateNaissance: Date | null;
        adresse: string | null;
    }>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    getRendezVous(userId: string, filters?: {
        statut?: StatutRendezVous;
        medecinId?: string;
        type?: 'passe' | 'futur' | 'all';
        page?: number;
        limit?: number;
    }): Promise<{
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
    createRendezVous(userId: string, createRendezVousDto: CreateRendezVousDto): Promise<{
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
    getNotifications(userId: string, filters?: {
        lue?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
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
    markNotificationsAsRead(userId: string, notificationIds?: string[]): Promise<{
        message: string;
    }>;
    updatePreferences(userId: string, updatePreferencesDto: UpdatePreferencesDto): Promise<{
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
    updateRendezVousStatus(userId: string, rendezvousId: string, statut: StatutRendezVous): Promise<{
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
}
