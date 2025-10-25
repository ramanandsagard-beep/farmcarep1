"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_module_1 = require("./config/config.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const equipment_module_1 = require("./equipment/equipment.module");
const equipment_bookings_module_1 = require("./equipment-bookings/equipment-bookings.module");
const inputs_module_1 = require("./inputs/inputs.module");
const produce_module_1 = require("./produce/produce.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const transport_module_1 = require("./transport/transport.module");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const reviews_module_1 = require("./reviews/reviews.module");
const notifications_module_1 = require("./notifications/notifications.module");
const admin_module_1 = require("./stats/admin.module");
const health_module_1 = require("./health/health.module");
const common_module_1 = require("./common/common.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_module_1.ConfigModule],
                useFactory: async () => ({
                    type: 'postgres',
                    url: process.env.DATABASE_URL,
                    autoLoadEntities: true,
                    synchronize: false,
                    ssl: false,
                }),
            }),
            common_module_1.CommonModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            equipment_module_1.EquipmentModule,
            equipment_bookings_module_1.EquipmentBookingsModule,
            inputs_module_1.InputsModule,
            produce_module_1.ProduceModule,
            vehicles_module_1.VehiclesModule,
            transport_module_1.TransportModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            reviews_module_1.ReviewsModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map