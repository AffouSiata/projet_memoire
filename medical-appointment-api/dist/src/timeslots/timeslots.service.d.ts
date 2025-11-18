import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeSlotDto } from './dto/create-timeslot.dto';
import { UpdateTimeSlotDto } from './dto/update-timeslot.dto';
import { JourSemaine } from '@prisma/client';
export declare class TimeslotsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAvailableTimeSlots(medecinId: string, jour?: JourSemaine, date?: string): Promise<Record<import("@prisma/client").$Enums.JourSemaine, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        jour: import("@prisma/client").$Enums.JourSemaine;
        heureDebut: string;
        heureFin: string;
        isAvailable: boolean;
    }[]> | {
        unavailable: boolean;
        raison: string | null;
        date: Date;
    }>;
    getMedecinTimeSlots(medecinId: string, jour?: JourSemaine): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        jour: import("@prisma/client").$Enums.JourSemaine;
        heureDebut: string;
        heureFin: string;
        isAvailable: boolean;
    }[]>;
    createTimeSlot(medecinId: string, createTimeSlotDto: CreateTimeSlotDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        jour: import("@prisma/client").$Enums.JourSemaine;
        heureDebut: string;
        heureFin: string;
        isAvailable: boolean;
    }>;
    createBulkTimeSlots(medecinId: string, createTimeSlotsDto: CreateTimeSlotDto[]): Promise<{
        created: any[];
        errors: any[];
        summary: {
            totalAttempted: number;
            successful: number;
            failed: number;
        };
    }>;
    updateTimeSlot(medecinId: string, timeslotId: string, updateTimeSlotDto: UpdateTimeSlotDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        jour: import("@prisma/client").$Enums.JourSemaine;
        heureDebut: string;
        heureFin: string;
        isAvailable: boolean;
    }>;
    deleteTimeSlot(medecinId: string, timeslotId: string): Promise<{
        message: string;
    }>;
    generateWeeklyTimeSlots(medecinId: string, jours: JourSemaine[], heureDebut: string, heureFin: string, dureeSlot?: number): Promise<{
        created: any[];
        errors: any[];
        summary: {
            totalAttempted: number;
            successful: number;
            failed: number;
        };
    }>;
}
