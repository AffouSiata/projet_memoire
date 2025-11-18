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
exports.TimeslotsController = void 0;
const common_1 = require("@nestjs/common");
const timeslots_service_1 = require("./timeslots.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_timeslot_dto_1 = require("./dto/create-timeslot.dto");
const update_timeslot_dto_1 = require("./dto/update-timeslot.dto");
const client_1 = require("@prisma/client");
let TimeslotsController = class TimeslotsController {
    timeslotsService;
    constructor(timeslotsService) {
        this.timeslotsService = timeslotsService;
    }
    async getAvailableTimeSlots(medecinId, jour, date) {
        return this.timeslotsService.getAvailableTimeSlots(medecinId, jour, date);
    }
    async getMedecinTimeSlots(user, jour) {
        return this.timeslotsService.getMedecinTimeSlots(user.id, jour);
    }
    async createTimeSlot(user, createTimeSlotDto) {
        return this.timeslotsService.createTimeSlot(user.id, createTimeSlotDto);
    }
    async createBulkTimeSlots(user, body) {
        return this.timeslotsService.createBulkTimeSlots(user.id, body.timeslots);
    }
    async generateWeeklyTimeSlots(user, body) {
        return this.timeslotsService.generateWeeklyTimeSlots(user.id, body.jours, body.heureDebut, body.heureFin, body.dureeSlot);
    }
    async updateTimeSlot(user, timeslotId, updateTimeSlotDto) {
        return this.timeslotsService.updateTimeSlot(user.id, timeslotId, updateTimeSlotDto);
    }
    async deleteTimeSlot(user, timeslotId) {
        return this.timeslotsService.deleteTimeSlot(user.id, timeslotId);
    }
};
exports.TimeslotsController = TimeslotsController;
__decorate([
    (0, common_1.Get)('timeslots/:medecinId'),
    __param(0, (0, common_1.Param)('medecinId')),
    __param(1, (0, common_1.Query)('jour')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "getAvailableTimeSlots", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MEDECIN),
    (0, common_1.Get)('medecins/timeslots'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('jour')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "getMedecinTimeSlots", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MEDECIN),
    (0, common_1.Post)('medecins/timeslots'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_timeslot_dto_1.CreateTimeSlotDto]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "createTimeSlot", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MEDECIN),
    (0, common_1.Post)('medecins/timeslots/bulk'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "createBulkTimeSlots", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MEDECIN),
    (0, common_1.Post)('medecins/timeslots/generate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "generateWeeklyTimeSlots", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MEDECIN),
    (0, common_1.Patch)('medecins/timeslots/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_timeslot_dto_1.UpdateTimeSlotDto]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "updateTimeSlot", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MEDECIN),
    (0, common_1.Delete)('medecins/timeslots/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "deleteTimeSlot", null);
exports.TimeslotsController = TimeslotsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [timeslots_service_1.TimeslotsService])
], TimeslotsController);
//# sourceMappingURL=timeslots.controller.js.map