import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EquipmentModule } from './equipment/equipment.module';
import { EquipmentBookingsModule } from './equipment-bookings/equipment-bookings.module';
import { InputsModule } from './inputs/inputs.module';
import { ProduceModule } from './produce/produce.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TransportModule } from './transport/transport.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './stats/admin.module';
import { HealthModule } from './health/health.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: false,
        ssl: false,
      }),
    }),
    CommonModule,
    UsersModule,
    AuthModule,
    EquipmentModule,
    EquipmentBookingsModule,
    InputsModule,
    ProduceModule,
    VehiclesModule,
    TransportModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    ReviewsModule,
    NotificationsModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
