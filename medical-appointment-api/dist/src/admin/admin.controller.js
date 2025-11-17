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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const update_user_status_dto_1 = require("./dto/update-user-status.dto");
const update_admin_profile_dto_1 = require("./dto/update-admin-profile.dto");
const update_rendezvous_dto_1 = require("../medecins/dto/update-rendezvous.dto");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getPatients(search, isActive, page, limit) {
        return this.adminService.getPatients({ search, isActive, page, limit });
    }
    async updatePatientStatus(patientId, updateStatusDto) {
        return this.adminService.updatePatientStatus(patientId, updateStatusDto);
    }
    async getMedecins(search, specialite, isActive, page, limit) {
        return this.adminService.getMedecins({
            search,
            specialite,
            isActive,
            page,
            limit,
        });
    }
    async updateMedecinStatus(medecinId, updateStatusDto) {
        return this.adminService.updateMedecinStatus(medecinId, updateStatusDto);
    }
    async approveMedecin(medecinId) {
        return this.adminService.approveMedecin(medecinId);
    }
    async rejectMedecin(medecinId) {
        return this.adminService.rejectMedecin(medecinId);
    }
    async getRendezVous(statut, patientId, medecinId, page, limit) {
        return this.adminService.getRendezVous({
            statut,
            patientId,
            medecinId,
            page,
            limit,
        });
    }
    async updateRendezVous(rendezVousId, updateRendezVousDto) {
        return this.adminService.updateRendezVous(rendezVousId, updateRendezVousDto);
    }
    async getNotifications(user, lue, page, limit) {
        return this.adminService.getNotifications(user.id, { lue, page, limit });
    }
    async markNotificationsAsRead(user, body) {
        return this.adminService.markNotificationsAsRead(user.id, body?.notificationIds);
    }
    async getStatistics() {
        return this.adminService.getStatistics();
    }
    async getProfile(user) {
        return this.adminService.getProfile(user.id);
    }
    async updateProfile(user, updateProfileDto) {
        return this.adminService.updateProfile(user.id, updateProfileDto);
    }
    async getAuditLogs(limit, page, status) {
        return this.adminService.getAuditLogs({ limit, page, status });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('patients'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('isActive', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPatients", null);
__decorate([
    (0, common_1.Patch)('patients/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_status_dto_1.UpdateUserStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updatePatientStatus", null);
__decorate([
    (0, common_1.Get)('medecins'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('specialite')),
    __param(2, (0, common_1.Query)('isActive', new common_1.ParseBoolPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMedecins", null);
__decorate([
    (0, common_1.Patch)('medecins/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_status_dto_1.UpdateUserStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateMedecinStatus", null);
__decorate([
    (0, common_1.Patch)('medecins/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveMedecin", null);
__decorate([
    (0, common_1.Patch)('medecins/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectMedecin", null);
__decorate([
    (0, common_1.Get)('rendezvous'),
    __param(0, (0, common_1.Query)('statut')),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('medecinId')),
    __param(3, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRendezVous", null);
__decorate([
    (0, common_1.Patch)('rendezvous/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rendezvous_dto_1.UpdateRendezVousDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRendezVous", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('lue', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)('notifications/mark-as-read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markNotificationsAsRead", null);
__decorate([
    (0, common_1.Get)('statistiques'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_admin_profile_dto_1.UpdateAdminProfileDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map