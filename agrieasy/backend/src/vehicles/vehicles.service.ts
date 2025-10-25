import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(@InjectRepository(VehicleEntity) private repo: Repository<VehicleEntity>) {}

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(transporterId: string, data: { vehicleType: string; capacityKg: number; plateNumber: string; imageUrl?: string }) {
    const v = this.repo.create({ transporterId, vehicleType: data.vehicleType, capacityKg: data.capacityKg, plateNumber: data.plateNumber, imageUrl: data.imageUrl });
    return this.repo.save(v);
  }

  async updateImageUrl(id: string, imageUrl: string) {
    await this.repo.update(id, { imageUrl });
    return this.repo.findOne({ where: { id } });
  }
}
