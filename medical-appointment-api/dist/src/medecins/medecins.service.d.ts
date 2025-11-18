import { PrismaService } from '../prisma/prisma.service';
import { UpdateMedecinDto } from './dto/update-medecin.dto';
import { UpdateRendezVousDto } from './dto/update-rendezvous.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateIndisponibiliteDto } from './dto/create-indisponibilite.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { StatutRendezVous, StatutNote } from '@prisma/client';
export declare class MedecinsService {
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
        adresse: string | null;
        createdAt: Date;
        specialite: string | null;
    }>;
    updateProfile(userId: string, updateMedecinDto: UpdateMedecinDto): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        telephone: string;
        adresse: string | null;
        specialite: string | null;
    }>;
    getRendezVous(userId: string, filters?: {
        statut?: StatutRendezVous;
        patientId?: string;
        type?: 'passe' | 'futur' | 'all';
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
    updateRendezVous(userId: string, rendezVousId: string, updateRendezVousDto: UpdateRendezVousDto): Promise<{
        patient: {
            id: string;
            nom: string;
            prenom: string;
            telephone: string;
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
    getPatients(userId: string, filters?: {
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
    getNotes(userId: string, filters?: {
        patientId?: string;
        statut?: StatutNote;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            patient: {
                id: string;
                nom: string;
                prenom: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            medecinId: string;
            statut: import("@prisma/client").$Enums.StatutNote;
            patientId: string;
            contenu: string;
            piecesJointes: string[];
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createNote(userId: string, createNoteDto: CreateNoteDto): Promise<{
        patient: {
            id: string;
            nom: string;
            prenom: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        statut: import("@prisma/client").$Enums.StatutNote;
        patientId: string;
        contenu: string;
        piecesJointes: string[];
    }>;
    updateNote(userId: string, noteId: string, updateNoteDto: UpdateNoteDto): Promise<{
        patient: {
            id: string;
            nom: string;
            prenom: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        statut: import("@prisma/client").$Enums.StatutNote;
        patientId: string;
        contenu: string;
        piecesJointes: string[];
    }>;
    deleteNote(userId: string, noteId: string): Promise<{
        message: string;
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
    uploadAttachment(userId: string, noteId: string, filePath: string): Promise<{
        patient: {
            id: string;
            nom: string;
            prenom: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        statut: import("@prisma/client").$Enums.StatutNote;
        patientId: string;
        contenu: string;
        piecesJointes: string[];
    }>;
    getIndisponibilites(medecinId: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        date: Date;
        raison: string | null;
    }[]>;
    createIndisponibilite(medecinId: string, createIndisponibiliteDto: CreateIndisponibiliteDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        date: Date;
        raison: string | null;
    }>;
    deleteIndisponibilite(medecinId: string, indisponibiliteId: string): Promise<{
        message: string;
    }>;
}
