import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportBookingEntity } from './transport-booking.entity';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransportBookingEntity])],
  providers: [TransportService],
  controllers: [TransportController],
})
export class TransportModule {}
