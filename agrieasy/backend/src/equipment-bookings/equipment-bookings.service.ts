import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentBookingEntity } from './equipment-booking.entity';

@Injectable()
export class EquipmentBookingsService {
  constructor(@InjectRepository(EquipmentBookingEntity) private repo: Repository<EquipmentBookingEntity>) {}

  async create(farmerId: string, data: { equipmentId: string; startTime: string; endTime: string }) {
    const booking = this.repo.create({
      farmerId,
      equipmentId: data.equipmentId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      status: 'PENDING',
    });
    try {
      return await this.repo.save(booking);
    } catch (e: any) {
      throw new BadRequestException('Booking overlaps or invalid');
    }
  }
}
