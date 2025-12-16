import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseBoolPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MedecinsService } from './medecins.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateMedecinDto } from './dto/update-medecin.dto';
import { UpdateRendezVousDto } from './dto/update-rendezvous.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateIndisponibiliteDto } from './dto/create-indisponibilite.dto';
import { Role, StatutRendezVous, StatutNote } from '@prisma/client';
import { multerConfig } from '../upload/multer.config';

@Controller('medecins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MEDECIN)
export class MedecinsController {
  constructor(private readonly medecinsService: MedecinsService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.medecinsService.getProfile(user.id);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateMedecinDto: UpdateMedecinDto,
  ) {
    return this.medecinsService.updateProfile(user.id, updateMedecinDto);
  }

  @Get('rendezvous')
  async getRendezVous(
    @CurrentUser() user: any,
    @Query('statut') statut?: StatutRendezVous,
    @Query('patientId') patientId?: string,
    @Query('type') type?: 'passe' | 'futur' | 'all',
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.medecinsService.getRendezVous(user.id, {
      statut,
      patientId,
      type,
      page,
      limit,
    });
  }

  @Patch('rendezvous/:id')
  async updateRendezVous(
    @CurrentUser() user: any,
    @Param('id') rendezVousId: string,
    @Body() updateRendezVousDto: UpdateRendezVousDto,
  ) {
    return this.medecinsService.updateRendezVous(
      user.id,
      rendezVousId,
      updateRendezVousDto,
    );
  }

  @Get('patients')
  async getPatients(
    @CurrentUser() user: any,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.medecinsService.getPatients(user.id, { page, limit });
  }

  @Get('notes')
  async getNotes(
    @CurrentUser() user: any,
    @Query('patientId') patientId?: string,
    @Query('statut') statut?: StatutNote,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.medecinsService.getNotes(user.id, {
      patientId,
      statut,
      page,
      limit,
    });
  }

  @Post('notes')
  async createNote(
    @CurrentUser() user: any,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return this.medecinsService.createNote(user.id, createNoteDto);
  }

  @Patch('notes/:id')
  async updateNote(
    @CurrentUser() user: any,
    @Param('id') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.medecinsService.updateNote(user.id, noteId, updateNoteDto);
  }

  @Delete('notes/:id')
  async deleteNote(@CurrentUser() user: any, @Param('id') noteId: string) {
    return this.medecinsService.deleteNote(user.id, noteId);
  }

  @Get('notifications')
  async getNotifications(
    @CurrentUser() user: any,
    @Query('lue', new ParseBoolPipe({ optional: true })) lue?: boolean,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.medecinsService.getNotifications(user.id, { lue, page, limit });
  }

  @Patch('notifications/mark-as-read')
  async markNotificationsAsRead(
    @CurrentUser() user: any,
    @Body() body?: { notificationIds?: string[] },
  ) {
    return this.medecinsService.markNotificationsAsRead(
      user.id,
      body?.notificationIds,
    );
  }

  @Post('notes/:id/upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadAttachment(
    @CurrentUser() user: any,
    @Param('id') noteId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Aucun fichier fourni');
    }
    return this.medecinsService.uploadAttachment(user.id, noteId, file.path);
  }

  @Get('indisponibilites')
  async getIndisponibilites(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.medecinsService.getIndisponibilites(
      user.id,
      startDate,
      endDate,
    );
  }

  @Post('indisponibilites')
  async createIndisponibilite(
    @CurrentUser() user: any,
    @Body() createIndisponibiliteDto: CreateIndisponibiliteDto,
  ) {
    return this.medecinsService.createIndisponibilite(
      user.id,
      createIndisponibiliteDto,
    );
  }

  @Delete('indisponibilites/:id')
  async deleteIndisponibilite(
    @CurrentUser() user: any,
    @Param('id') indisponibiliteId: string,
  ) {
    return this.medecinsService.deleteIndisponibilite(user.id, indisponibiliteId);
  }
}
