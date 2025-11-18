import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { UpdateRendezVousDto } from '../medecins/dto/update-rendezvous.dto';
import { Role, StatutRendezVous } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('patients')
  async getPatients(
    @Query('search') search?: string,
    @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.adminService.getPatients({ search, isActive, page, limit });
  }

  @Patch('patients/:id')
  async updatePatientStatus(
    @Param('id') patientId: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updatePatientStatus(patientId, updateStatusDto);
  }

  @Get('medecins')
  async getMedecins(
    @Query('search') search?: string,
    @Query('specialite') specialite?: string,
    @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
    @Query('statutValidation') statutValidation?: 'PENDING' | 'APPROVED' | 'REJECTED',
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.adminService.getMedecins({
      search,
      specialite,
      isActive,
      statutValidation: statutValidation as any,
      page,
      limit,
    });
  }

  @Patch('medecins/:id')
  async updateMedecinStatus(
    @Param('id') medecinId: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.updateMedecinStatus(medecinId, updateStatusDto, admin.id);
  }

  @Patch('medecins/:id/approve')
  async approveMedecin(
    @Param('id') medecinId: string,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.approveMedecin(medecinId, admin.id);
  }

  @Patch('medecins/:id/reject')
  async rejectMedecin(
    @Param('id') medecinId: string,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.rejectMedecin(medecinId, admin.id);
  }

  @Get('rendezvous')
  async getRendezVous(
    @Query('statut') statut?: StatutRendezVous,
    @Query('patientId') patientId?: string,
    @Query('medecinId') medecinId?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.adminService.getRendezVous({
      statut,
      patientId,
      medecinId,
      page,
      limit,
    });
  }

  @Patch('rendezvous/:id')
  async updateRendezVous(
    @Param('id') rendezVousId: string,
    @Body() updateRendezVousDto: UpdateRendezVousDto,
  ) {
    return this.adminService.updateRendezVous(rendezVousId, updateRendezVousDto);
  }

  @Get('notifications')
  async getNotifications(
    @CurrentUser() user: any,
    @Query('lue', new ParseBoolPipe({ optional: true })) lue?: boolean,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.adminService.getNotifications(user.id, { lue, page, limit });
  }

  @Patch('notifications/mark-as-read')
  async markNotificationsAsRead(
    @CurrentUser() user: any,
    @Body() body?: { notificationIds?: string[] },
  ) {
    return this.adminService.markNotificationsAsRead(
      user.id,
      body?.notificationIds,
    );
  }

  @Get('statistiques')
  async getStatistics() {
    return this.adminService.getStatistics();
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.adminService.getProfile(user.id);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateAdminProfileDto,
  ) {
    return this.adminService.updateProfile(user.id, updateProfileDto);
  }

  @Get('audit-logs')
  async getAuditLogs(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAuditLogs({ limit, page, status });
  }
}
