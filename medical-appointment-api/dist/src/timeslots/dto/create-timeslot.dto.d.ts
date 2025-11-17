import { JourSemaine } from '@prisma/client';
export declare class CreateTimeSlotDto {
    jour: JourSemaine;
    heureDebut: string;
    heureFin: string;
    isAvailable?: boolean;
}
