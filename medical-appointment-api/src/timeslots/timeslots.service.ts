import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeSlotDto } from './dto/create-timeslot.dto';
import { UpdateTimeSlotDto } from './dto/update-timeslot.dto';
import { JourSemaine } from '@prisma/client';

@Injectable()
export class TimeslotsService {
  constructor(private prisma: PrismaService) {}

  // GET /timeslots (public - pour voir les créneaux disponibles)
  async getAvailableTimeSlots(medecinId: string, jour?: JourSemaine, date?: string) {
    const where: any = {
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

    // Si une date spécifique est fournie, vérifier les indisponibilités
    if (date) {
      const unavailability = await this.prisma.medecinIndisponibilite.findUnique({
        where: {
          medecinId_date: {
            medecinId,
            date: new Date(date),
          },
        },
      });

      // Si le médecin est indisponible ce jour-là, retourner un objet vide ou une indication
      if (unavailability) {
        return {
          unavailable: true,
          raison: unavailability.raison,
          date: unavailability.date,
        };
      }
    }

    // Grouper par jour
    const grouped = timeslots.reduce((acc, slot) => {
      if (!acc[slot.jour]) {
        acc[slot.jour] = [];
      }
      acc[slot.jour].push(slot);
      return acc;
    }, {} as Record<JourSemaine, typeof timeslots>);

    return grouped;
  }

  // GET /medecins/timeslots (pour le médecin)
  async getMedecinTimeSlots(medecinId: string, jour?: JourSemaine) {
    const where: any = {
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

  // POST /medecins/timeslots
  async createTimeSlot(medecinId: string, createTimeSlotDto: CreateTimeSlotDto) {
    // Vérifier que l'heure de début est avant l'heure de fin
    if (createTimeSlotDto.heureDebut >= createTimeSlotDto.heureFin) {
      throw new BadRequestException(
        "L'heure de début doit être avant l'heure de fin",
      );
    }

    // Vérifier qu'il n'existe pas déjà un créneau à ce moment
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
      throw new BadRequestException('Ce créneau existe déjà');
    }

    const timeslot = await this.prisma.timeSlot.create({
      data: {
        medecinId,
        ...createTimeSlotDto,
      },
    });

    return timeslot;
  }

  // POST /medecins/timeslots/bulk (créer plusieurs créneaux)
  async createBulkTimeSlots(
    medecinId: string,
    createTimeSlotsDto: CreateTimeSlotDto[],
  ) {
    const created: any[] = [];
    const errors: any[] = [];

    for (const dto of createTimeSlotsDto) {
      try {
        const timeslot = await this.createTimeSlot(medecinId, dto);
        created.push(timeslot);
      } catch (error) {
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

  // PATCH /medecins/timeslots/:id
  async updateTimeSlot(
    medecinId: string,
    timeslotId: string,
    updateTimeSlotDto: UpdateTimeSlotDto,
  ) {
    const timeslot = await this.prisma.timeSlot.findUnique({
      where: { id: timeslotId },
    });

    if (!timeslot) {
      throw new NotFoundException('Créneau non trouvé');
    }

    if (timeslot.medecinId !== medecinId) {
      throw new ForbiddenException('Accès interdit');
    }

    const updated = await this.prisma.timeSlot.update({
      where: { id: timeslotId },
      data: updateTimeSlotDto,
    });

    return updated;
  }

  // DELETE /medecins/timeslots/:id
  async deleteTimeSlot(medecinId: string, timeslotId: string) {
    const timeslot = await this.prisma.timeSlot.findUnique({
      where: { id: timeslotId },
    });

    if (!timeslot) {
      throw new NotFoundException('Créneau non trouvé');
    }

    if (timeslot.medecinId !== medecinId) {
      throw new ForbiddenException('Accès interdit');
    }

    await this.prisma.timeSlot.delete({
      where: { id: timeslotId },
    });

    return { message: 'Créneau supprimé avec succès' };
  }

  // Fonction utilitaire pour générer des créneaux automatiques
  async generateWeeklyTimeSlots(
    medecinId: string,
    jours: JourSemaine[],
    heureDebut: string,
    heureFin: string,
    dureeSlot: number = 30, // en minutes
  ) {
    const slots: CreateTimeSlotDto[] = [];

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
}
