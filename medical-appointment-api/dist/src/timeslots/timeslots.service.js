"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeslotsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TimeslotsService = class TimeslotsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAvailableTimeSlots(medecinId, jour) {
        const where = {
            medecinId,
            isAvailable: true,
        };
        if (jour) {
            where.jour = jour;
        }
        const timeslots = await this.prisma.timeSlot.findMany({
            where,
            orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
        });
        const grouped = timeslots.reduce((acc, slot) => {
            if (!acc[slot.jour]) {
                acc[slot.jour] = [];
            }
            acc[slot.jour].push(slot);
            return acc;
        }, {});
        return grouped;
    }
    async getMedecinTimeSlots(medecinId, jour) {
        const where = {
            medecinId,
        };
        if (jour) {
            where.jour = jour;
        }
        const timeslots = await this.prisma.timeSlot.findMany({
            where,
            orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
        });
        return timeslots;
    }
    async createTimeSlot(medecinId, createTimeSlotDto) {
        if (createTimeSlotDto.heureDebut >= createTimeSlotDto.heureFin) {
            throw new common_1.BadRequestException("L'heure de début doit être avant l'heure de fin");
        }
        const existing = await this.prisma.timeSlot.findUnique({
            where: {
                medecinId_jour_heureDebut: {
                    medecinId,
                    jour: createTimeSlotDto.jour,
                    heureDebut: createTimeSlotDto.heureDebut,
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Ce créneau existe déjà');
        }
        const timeslot = await this.prisma.timeSlot.create({
            data: {
                medecinId,
                ...createTimeSlotDto,
            },
        });
        return timeslot;
    }
    async createBulkTimeSlots(medecinId, createTimeSlotsDto) {
        const created = [];
        const errors = [];
        for (const dto of createTimeSlotsDto) {
            try {
                const timeslot = await this.createTimeSlot(medecinId, dto);
                created.push(timeslot);
            }
            catch (error) {
                errors.push({
                    slot: dto,
                    error: error.message,
                });
            }
        }
        return {
            created,
            errors,
            summary: {
                totalAttempted: createTimeSlotsDto.length,
                successful: created.length,
                failed: errors.length,
            },
        };
    }
    async updateTimeSlot(medecinId, timeslotId, updateTimeSlotDto) {
        const timeslot = await this.prisma.timeSlot.findUnique({
            where: { id: timeslotId },
        });
        if (!timeslot) {
            throw new common_1.NotFoundException('Créneau non trouvé');
        }
        if (timeslot.medecinId !== medecinId) {
            throw new common_1.ForbiddenException('Accès interdit');
        }
        const updated = await this.prisma.timeSlot.update({
            where: { id: timeslotId },
            data: updateTimeSlotDto,
        });
        return updated;
    }
    async deleteTimeSlot(medecinId, timeslotId) {
        const timeslot = await this.prisma.timeSlot.findUnique({
            where: { id: timeslotId },
        });
        if (!timeslot) {
            throw new common_1.NotFoundException('Créneau non trouvé');
        }
        if (timeslot.medecinId !== medecinId) {
            throw new common_1.ForbiddenException('Accès interdit');
        }
        await this.prisma.timeSlot.delete({
            where: { id: timeslotId },
        });
        return { message: 'Créneau supprimé avec succès' };
    }
    async generateWeeklyTimeSlots(medecinId, jours, heureDebut, heureFin, dureeSlot = 30) {
        const slots = [];
        for (const jour of jours) {
            const [heureD, minuteD] = heureDebut.split(':').map(Number);
            const [heureF, minuteF] = heureFin.split(':').map(Number);
            let currentMinutes = heureD * 60 + minuteD;
            const endMinutes = heureF * 60 + minuteF;
            while (currentMinutes + dureeSlot <= endMinutes) {
                const startHour = Math.floor(currentMinutes / 60);
                const startMinute = currentMinutes % 60;
                const endHour = Math.floor((currentMinutes + dureeSlot) / 60);
                const endMinute = (currentMinutes + dureeSlot) % 60;
                slots.push({
                    jour,
                    heureDebut: `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`,
                    heureFin: `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`,
                    isAvailable: true,
                });
                currentMinutes += dureeSlot;
            }
        }
        return this.createBulkTimeSlots(medecinId, slots);
    }
};
exports.TimeslotsService = TimeslotsService;
exports.TimeslotsService = TimeslotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TimeslotsService);
//# sourceMappingURL=timeslots.service.js.map