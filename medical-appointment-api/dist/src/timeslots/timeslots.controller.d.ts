import { TimeslotsService } from './timeslots.service';
import { CreateTimeSlotDto } from './dto/create-timeslot.dto';
import { UpdateTimeSlotDto } from './dto/update-timeslot.dto';
import { JourSemaine } from '@prisma/client';
export declare class TimeslotsController {
    private readonly timeslotsService;
    constructor(timeslotsService: TimeslotsService);
    getAvailableTimeSlots(medecinId: string, jour?: JourSemaine): Promise<Record<import("@prisma/client").$Enums.JourSemaine, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        jour: import("@prisma/client").$Enums.JourSemaine;
        heureDebut: string;
        heureFin: string;
        isAvailable: boolean;
    }[]>>;
    getMedecinTimeSlots(user: any, jour?: JourSemaine): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        jour: import("@prisma/client").$Enums.JourSemaine;
        heureDebut: string;
        heureFin: string;
        isAvailable: boolean;
    }[]>;
    createTimeSlot(user: any, createTimeSlotDto: CreateTimeSlotDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        jour: import("@prisma/client").$Enums.JourSemaine;
        heureDebut: string;
        heureFin: string;
        isAvailable: boolean;
    }>;
    createBulkTimeSlots(user: any, body: {
        timeslots: CreateTimeSlotDto[];
    }): Promise<{
        created: any[];
        errors: any[];
        summary: {
            totalAttempted: number;
            successful: number;
            failed: number;
        };
    }>;
    generateWeeklyTimeSlots(user: any, body: {
        jours: JourSemaine[];
        heureDebut: string;
        heureFin: string;
        dureeSlot?: number;
    }): Promise<{
        created: any[];
        errors: any[];
        summary: {
            totalAttempted: number;
            successful: number;
            failed: number;
        };
    }>;
    updateTimeSlot(user: any, timeslotId: string, updateTimeSlotDto: UpdateTimeSlotDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        medecinId: string;
        jour: import("@prisma/client").$Enums.JourSemaine;
        heureDebut: string;
        heureFin: string;
        isAvailable: boolean;
    }>;
    deleteTimeSlot(user: any, timeslotId: string): Promise<{
        message: string;
    }>;
}
