import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateTimeSlotDto } from './dto/create-timeslot.dto';
import { UpdateTimeSlotDto } from './dto/update-timeslot.dto';
import { Role, JourSemaine } from '@prisma/client';

@Controller()
export class TimeslotsController {
  constructor(private readonly timeslotsService: TimeslotsService) {}

  // Public endpoint - voir les créneaux disponibles d'un médecin
  @Get('timeslots/:medecinId')
  async getAvailableTimeSlots(
    @Param('medecinId') medecinId: string,
    @Query('jour') jour?: JourSemaine,
    @Query('date') date?: string,
  ) {
    return this.timeslotsService.getAvailableTimeSlots(medecinId, jour, date);
  }

  // Endpoints protégés pour les médecins
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEDECIN)
  @Get('medecins/timeslots')
  async getMedecinTimeSlots(
    @CurrentUser() user: any,
    @Query('jour') jour?: JourSemaine,
  ) {
    return this.timeslotsService.getMedecinTimeSlots(user.id, jour);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEDECIN)
  @Post('medecins/timeslots')
  async createTimeSlot(
    @CurrentUser() user: any,
    @Body() createTimeSlotDto: CreateTimeSlotDto,
  ) {
    return this.timeslotsService.createTimeSlot(user.id, createTimeSlotDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEDECIN)
  @Post('medecins/timeslots/bulk')
  async createBulkTimeSlots(
    @CurrentUser() user: any,
    @Body() body: { timeslots: CreateTimeSlotDto[] },
  ) {
    return this.timeslotsService.createBulkTimeSlots(user.id, body.timeslots);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEDECIN)
  @Post('medecins/timeslots/generate')
  async generateWeeklyTimeSlots(
    @CurrentUser() user: any,
    @Body()
    body: {
      jours: JourSemaine[];
      heureDebut: string;
      heureFin: string;
      dureeSlot?: number;
    },
  ) {
    return this.timeslotsService.generateWeeklyTimeSlots(
      user.id,
      body.jours,
      body.heureDebut,
      body.heureFin,
      body.dureeSlot,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEDECIN)
  @Patch('medecins/timeslots/:id')
  async updateTimeSlot(
    @CurrentUser() user: any,
    @Param('id') timeslotId: string,
    @Body() updateTimeSlotDto: UpdateTimeSlotDto,
  ) {
    return this.timeslotsService.updateTimeSlot(
      user.id,
      timeslotId,
      updateTimeSlotDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEDECIN)
  @Delete('medecins/timeslots/:id')
  async deleteTimeSlot(
    @CurrentUser() user: any,
    @Param('id') timeslotId: string,
  ) {
    return this.timeslotsService.deleteTimeSlot(user.id, timeslotId);
  }
}
