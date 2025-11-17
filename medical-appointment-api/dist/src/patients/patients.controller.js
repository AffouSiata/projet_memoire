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
exports.PatientsController = void 0;
const common_1 = require("@nestjs/common");
const patients_service_1 = require("./patients.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const update_patient_dto_1 = require("./dto/update-patient.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const update_preferences_dto_1 = require("./dto/update-preferences.dto");
const create_rendezvous_dto_1 = require("./dto/create-rendezvous.dto");
const update_rendezvous_status_dto_1 = require("./dto/update-rendezvous-status.dto");
const client_1 = require("@prisma/client");
let PatientsController = class PatientsController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    async getProfile(user) {
        return this.patientsService.getProfile(user.id);
    }
    async updateProfile(user, updatePatientDto) {
        return this.patientsService.updateProfile(user.id, updatePatientDto);
    }
    async updatePassword(user, updatePasswordDto) {
        return this.patientsService.updatePassword(user.id, updatePasswordDto);
    }
    async getRendezVous(user, statut, medecinId, type, page, limit) {
        return this.patientsService.getRendezVous(user.id, {
            statut,
            medecinId,
            type,
            page,
            limit,
        });
    }
    async createRendezVous(user, createRendezVousDto) {
        return this.patientsService.createRendezVous(user.id, createRendezVousDto);
    }
    async updateRendezVousStatus(user, id, updateRendezVousStatusDto) {
        return this.patientsService.updateRendezVousStatus(user.id, id, updateRendezVousStatusDto.statut);
    }
    async getNotifications(user, lue, page, limit) {
        return this.patientsService.getNotifications(user.id, { lue, page, limit });
    }
    async markNotificationsAsRead(user, body) {
        return this.patientsService.markNotificationsAsRead(user.id, body?.notificationIds);
    }
    async updatePreferences(user, updatePreferencesDto) {
        return this.patientsService.updatePreferences(user.id, updatePreferencesDto);
    }
    async getMedecins(specialite) {
        return this.patientsService.getMedecins(specialite);
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_patient_dto_1.UpdatePatientDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('me/password'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)('rendezvous'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('statut')),
    __param(2, (0, common_1.Query)('medecinId')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(5, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getRendezVous", null);
__decorate([
    (0, common_1.Post)('rendezvous'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_rendezvous_dto_1.CreateRendezVousDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "createRendezVous", null);
__decorate([
    (0, common_1.Patch)('rendezvous/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_rendezvous_status_dto_1.UpdateRendezVousStatusDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "updateRendezVousStatus", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('lue', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)('notifications/mark-as-read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "markNotificationsAsRead", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_preferences_dto_1.UpdatePreferencesDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Get)('medecins'),
    __param(0, (0, common_1.Query)('specialite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getMedecins", null);
exports.PatientsController = PatientsController = __decorate([
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.PATIENT),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map