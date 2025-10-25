import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportBookingEntity } from './transport-booking.entity';

@Injectable()
export class TransportService {
  constructor(@InjectRepository(TransportBookingEntity) private repo: Repository<TransportBookingEntity>) {}

  async create(farmerId: string, data: { vehicleId: string; source: string; destination: string; pickupTime: string; dropTime: string }) {
    const b = this.repo.create({
      farmerId,
      vehicleId: data.vehicleId,
      source: data.source,
      destination: data.destination,
      pickupTime: new Date(data.pickupTime),
      dropTime: new Date(data.dropTime),
      status: 'REQUESTED',
    });
    try {
      return await this.repo.save(b);
    } catch (e) {
      throw new BadRequestException('Booking overlaps or invalid');
    }
  }
}
