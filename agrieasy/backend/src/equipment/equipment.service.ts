import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentEntity } from './equipment.entity';

@Injectable()
export class EquipmentService {
  constructor(@InjectRepository(EquipmentEntity) private repo: Repository<EquipmentEntity>) {}

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  get(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(vendorId: string, data: { name: string; description?: string; pricePerDay: number; imageUrl?: string }) {
    const e = this.repo.create({ vendorId, name: data.name, description: data.description, pricePerDay: String(data.pricePerDay), imageUrl: data.imageUrl });
    return this.repo.save(e);
  }

  async updateImageUrl(id: string, imageUrl: string) {
    await this.repo.update(id, { imageUrl });
    return this.repo.findOne({ where: { id } });
  }
}
