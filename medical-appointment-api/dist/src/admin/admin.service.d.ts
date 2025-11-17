import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateRendezVousDto } from '../medecins/dto/update-rendezvous.dto';
import { StatutRendezVous } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AdminService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getPatients(filters?: {
        search?: string;
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            telephone: string;
            dateNaissance: Date | null;
            adresse: string | null;
            isActive: boolean;
            createdAt: Date;
            _count: {
                rendezvousPatient: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updatePatientStatus(patientId: string, updateStatusDto: UpdateUserStatusDto): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        isActive: boolean;
    }>;
    getMedecins(filters?: {
        search?: string;
        specialite?: string;
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            telephone: string;
            isActive: boolean;
            createdAt: Date;
            specialite: string | null;
            statutValidation: import("@prisma/client").$Enums.StatutValidation | null;
            _count: {
                rendezvousMedecin: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateMedecinStatus(medecinId: string, updateStatusDto: UpdateUserStatusDto): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        isActive: boolean;
        specialite: string | null;
    }>;
    approveMedecin(medecinId: string): Promise<{
        message: string;
        medecin: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            isActive: boolean;
            specialite: string | null;
            statutValidation: import("@prisma/client").$Enums.StatutValidation | null;
        };
    }>;
    rejectMedecin(medecinId: string): Promise<{
        message: string;
        medecin: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            isActive: boolean;
            specialite: string | null;
            statutValidation: import("@prisma/client").$Enums.StatutValidation | null;
        };
    }>;
    getRendezVous(filters?: {
        statut?: StatutRendezVous;
        patientId?: string;
        medecinId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            patient: {
                id: string;
                nom: string;
                prenom: string;
                telephone: string;
            };
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
    updateRendezVous(rendezVousId: string, updateRendezVousDto: UpdateRendezVousDto): Promise<{
        patient: {
            id: string;
            nom: string;
            prenom: string;
        };
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
    getStatistics(): Promise<{
        utilisateurs: {
            patients: {
                total: number;
                actifs: number;
            };
            medecins: {
                total: number;
                actifs: number;
            };
        };
        rendezVous: {
            total: number;
            parStatut: {
                statut: import("@prisma/client").$Enums.StatutRendezVous;
                count: number;
            }[];
            tauxAnnulation: number;
            parMedecin: {
                medecinId: string;
                nom: string;
                specialite: string;
                nombreRendezVous: number;
            }[];
            parSpecialite: unknown;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        telephone: string;
        preferencesNotifEmail: boolean;
        preferencesNotifSms: boolean;
        theme: import("@prisma/client").$Enums.Theme;
        langue: string;
    }>;
    updateProfile(userId: string, updateData: any): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        telephone: string;
        preferencesNotifEmail: boolean;
        preferencesNotifSms: boolean;
        theme: import("@prisma/client").$Enums.Theme;
        langue: string;
    }>;
    getAuditLogs(filters?: {
        limit?: number;
        page?: number;
        status?: string;
    }): Promise<{
        data: {
            id: string;
            user: string;
            action: string;
            ip: string;
            date: Date;
            status: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
