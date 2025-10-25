import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentBookingEntity } from './equipment-booking.entity';
import { EquipmentBookingsService } from './equipment-bookings.service';
import { EquipmentBookingsController } from './equipment-bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentBookingEntity])],
  providers: [EquipmentBookingsService],
  controllers: [EquipmentBookingsController],
})
export class EquipmentBookingsModule {}
