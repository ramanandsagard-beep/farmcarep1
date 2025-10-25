"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentBookingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const equipment_booking_entity_1 = require("./equipment-booking.entity");
const equipment_bookings_service_1 = require("./equipment-bookings.service");
const equipment_bookings_controller_1 = require("./equipment-bookings.controller");
let EquipmentBookingsModule = class EquipmentBookingsModule {
};
exports.EquipmentBookingsModule = EquipmentBookingsModule;
exports.EquipmentBookingsModule = EquipmentBookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([equipment_booking_entity_1.EquipmentBookingEntity])],
        providers: [equipment_bookings_service_1.EquipmentBookingsService],
        controllers: [equipment_bookings_controller_1.EquipmentBookingsController],
    })
], EquipmentBookingsModule);
//# sourceMappingURL=equipment-bookings.module.js.map