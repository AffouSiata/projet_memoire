import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { CreateRendezVousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezVousStatusDto } from './dto/update-rendezvous-status.dto';
import { Role, StatutRendezVous } from '@prisma/client';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PATIENT)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.patientsService.getProfile(user.id);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.updateProfile(user.id, updatePatientDto);
  }

  @Patch('me/password')
  async updatePassword(
    @CurrentUser() user: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.patientsService.updatePassword(user.id, updatePasswordDto);
  }

  @Get('rendezvous')
  async getRendezVous(
    @CurrentUser() user: any,
    @Query('statut') statut?: StatutRendezVous,
    @Query('medecinId') medecinId?: string,
    @Query('type') type?: 'passe' | 'futur' | 'all',
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.patientsService.getRendezVous(user.id, {
      statut,
      medecinId,
      type,
      page,
      limit,
    });
  }

  @Post('rendezvous')
  async createRendezVous(
    @CurrentUser() user: any,
    @Body() createRendezVousDto: CreateRendezVousDto,
  ) {
    return this.patientsService.createRendezVous(user.id, createRendezVousDto);
  }

  @Patch('rendezvous/:id')
  async updateRendezVousStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateRendezVousStatusDto: UpdateRendezVousStatusDto,
  ) {
    return this.patientsService.updateRendezVousStatus(
      user.id,
      id,
      updateRendezVousStatusDto.statut,
    );
  }

  @Get('notifications')
  async getNotifications(
    @CurrentUser() user: any,
    @Query('lue', new ParseBoolPipe({ optional: true })) lue?: boolean,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.patientsService.getNotifications(user.id, { lue, page, limit });
  }

  @Patch('notifications/mark-as-read')
  async markNotificationsAsRead(
    @CurrentUser() user: any,
    @Body() body?: { notificationIds?: string[] },
  ) {
    return this.patientsService.markNotificationsAsRead(
      user.id,
      body?.notificationIds,
    );
  }

  @Patch('preferences')
  async updatePreferences(
    @CurrentUser() user: any,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    return this.patientsService.updatePreferences(user.id, updatePreferencesDto);
  }

  @Get('medecins')
  async getMedecins(@Query('specialite') specialite?: string) {
    return this.patientsService.getMedecins(specialite);
  }
}
