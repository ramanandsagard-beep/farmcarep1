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
exports.EquipmentBookingsController = void 0;
const common_1 = require("@nestjs/common");
const equipment_bookings_service_1 = require("./equipment-bookings.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let EquipmentBookingsController = class EquipmentBookingsController {
    constructor(svc) {
        this.svc = svc;
    }
    create(req, body) {
        return this.svc.create(req.user.sub, body);
    }
};
exports.EquipmentBookingsController = EquipmentBookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('FARMER'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EquipmentBookingsController.prototype, "create", null);
exports.EquipmentBookingsController = EquipmentBookingsController = __decorate([
    (0, common_1.Controller)('equipment-bookings'),
    __metadata("design:paramtypes", [equipment_bookings_service_1.EquipmentBookingsService])
], EquipmentBookingsController);
//# sourceMappingURL=equipment-bookings.controller.js.map