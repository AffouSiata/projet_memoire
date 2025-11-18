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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedecinsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const medecins_service_1 = require("./medecins.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const update_medecin_dto_1 = require("./dto/update-medecin.dto");
const update_rendezvous_dto_1 = require("./dto/update-rendezvous.dto");
const create_note_dto_1 = require("./dto/create-note.dto");
const update_note_dto_1 = require("./dto/update-note.dto");
const create_indisponibilite_dto_1 = require("./dto/create-indisponibilite.dto");
const client_1 = require("@prisma/client");
const multer_config_1 = require("../upload/multer.config");
let MedecinsController = class MedecinsController {
    medecinsService;
    constructor(medecinsService) {
        this.medecinsService = medecinsService;
    }
    async getProfile(user) {
        return this.medecinsService.getProfile(user.id);
    }
    async updateProfile(user, updateMedecinDto) {
        return this.medecinsService.updateProfile(user.id, updateMedecinDto);
    }
    async getRendezVous(user, statut, patientId, type, page, limit) {
        return this.medecinsService.getRendezVous(user.id, {
            statut,
            patientId,
            type,
            page,
            limit,
        });
    }
    async updateRendezVous(user, rendezVousId, updateRendezVousDto) {
        return this.medecinsService.updateRendezVous(user.id, rendezVousId, updateRendezVousDto);
    }
    async getPatients(user, page, limit) {
        return this.medecinsService.getPatients(user.id, { page, limit });
    }
    async getNotes(user, patientId, statut, page, limit) {
        return this.medecinsService.getNotes(user.id, {
            patientId,
            statut,
            page,
            limit,
        });
    }
    async createNote(user, createNoteDto) {
        return this.medecinsService.createNote(user.id, createNoteDto);
    }
    async updateNote(user, noteId, updateNoteDto) {
        return this.medecinsService.updateNote(user.id, noteId, updateNoteDto);
    }
    async deleteNote(user, noteId) {
        return this.medecinsService.deleteNote(user.id, noteId);
    }
    async getNotifications(user, lue, page, limit) {
        return this.medecinsService.getNotifications(user.id, { lue, page, limit });
    }
    async markNotificationsAsRead(user, body) {
        return this.medecinsService.markNotificationsAsRead(user.id, body?.notificationIds);
    }
    async uploadAttachment(user, noteId, file) {
        if (!file) {
            throw new Error('Aucun fichier fourni');
        }
        return this.medecinsService.uploadAttachment(user.id, noteId, file.path);
    }
    async getIndisponibilites(user, startDate, endDate) {
        return this.medecinsService.getIndisponibilites(user.id, startDate, endDate);
    }
    async createIndisponibilite(user, createIndisponibiliteDto) {
        return this.medecinsService.createIndisponibilite(user.id, createIndisponibiliteDto);
    }
    async deleteIndisponibilite(user, indisponibiliteId) {
        return this.medecinsService.deleteIndisponibilite(user.id, indisponibiliteId);
    }
};
exports.MedecinsController = MedecinsController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_medecin_dto_1.UpdateMedecinDto]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('rendezvous'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('statut')),
    __param(2, (0, common_1.Query)('patientId')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(5, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "getRendezVous", null);
__decorate([
    (0, common_1.Patch)('rendezvous/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_rendezvous_dto_1.UpdateRendezVousDto]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "updateRendezVous", null);
__decorate([
    (0, common_1.Get)('patients'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "getPatients", null);
__decorate([
    (0, common_1.Get)('notes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('statut')),
    __param(3, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "getNotes", null);
__decorate([
    (0, common_1.Post)('notes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_note_dto_1.CreateNoteDto]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "createNote", null);
__decorate([
    (0, common_1.Patch)('notes/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_note_dto_1.UpdateNoteDto]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "updateNote", null);
__decorate([
    (0, common_1.Delete)('notes/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "deleteNote", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('lue', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)('notifications/mark-as-read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "markNotificationsAsRead", null);
__decorate([
    (0, common_1.Post)('notes/:id/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multer_config_1.multerConfig)),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "uploadAttachment", null);
__decorate([
    (0, common_1.Get)('indisponibilites'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "getIndisponibilites", null);
__decorate([
    (0, common_1.Post)('indisponibilites'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_indisponibilite_dto_1.CreateIndisponibiliteDto]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "createIndisponibilite", null);
__decorate([
    (0, common_1.Delete)('indisponibilites/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MedecinsController.prototype, "deleteIndisponibilite", null);
exports.MedecinsController = MedecinsController = __decorate([
    (0, common_1.Controller)('medecins'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MEDECIN),
    __metadata("design:paramtypes", [medecins_service_1.MedecinsService])
], MedecinsController);
//# sourceMappingURL=medecins.controller.js.map