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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportBookingEntity = void 0;
const typeorm_1 = require("typeorm");
let TransportBookingEntity = class TransportBookingEntity {
};
exports.TransportBookingEntity = TransportBookingEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TransportBookingEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_id' }),
    __metadata("design:type", String)
], TransportBookingEntity.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'farmer_id' }),
    __metadata("design:type", String)
], TransportBookingEntity.prototype, "farmerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TransportBookingEntity.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TransportBookingEntity.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pickup_time', type: 'timestamptz' }),
    __metadata("design:type", Date)
], TransportBookingEntity.prototype, "pickupTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'drop_time', type: 'timestamptz' }),
    __metadata("design:type", Date)
], TransportBookingEntity.prototype, "dropTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'REQUESTED' }),
    __metadata("design:type", String)
], TransportBookingEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TransportBookingEntity.prototype, "createdAt", void 0);
exports.TransportBookingEntity = TransportBookingEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'transport_bookings' })
], TransportBookingEntity);
//# sourceMappingURL=transport-booking.entity.js.map