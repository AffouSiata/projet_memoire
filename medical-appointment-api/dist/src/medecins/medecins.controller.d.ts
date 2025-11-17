import { MedecinsService } from './medecins.service';
import { UpdateMedecinDto } from './dto/update-medecin.dto';
import { UpdateRendezVousDto } from './dto/update-rendezvous.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { StatutRendezVous, StatutNote } from '@prisma/client';
export declare class MedecinsController {
    private readonly medecinsService;
    constructor(medecinsService: MedecinsService);
    getProfile(user: any): Promise<{
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
    updateProfile(user: any, updateMedecinDto: UpdateMedecinDto): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        telephone: string;
        adresse: string | null;
        specialite: string | null;
    }>;
    getRendezVous(user: any, statut?: StatutRendezVous, patientId?: string, type?: 'passe' | 'futur' | 'all', page?: number, limit?: number): Promise<{
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
    updateRendezVous(user: any, rendezVousId: string, updateRendezVousDto: UpdateRendezVousDto): Promise<{
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
    getPatients(user: any, page?: number, limit?: number): Promise<{
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
    getNotes(user: any, patientId?: string, statut?: StatutNote, page?: number, limit?: number): Promise<{
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
    createNote(user: any, createNoteDto: CreateNoteDto): Promise<{
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
    updateNote(user: any, noteId: string, updateNoteDto: UpdateNoteDto): Promise<{
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
    deleteNote(user: any, noteId: string): Promise<{
        message: string;
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
    uploadAttachment(user: any, noteId: string, file: Express.Multer.File): Promise<{
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
}
