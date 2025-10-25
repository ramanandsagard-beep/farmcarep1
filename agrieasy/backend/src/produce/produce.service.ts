import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProduceEntity } from './produce.entity';

@Injectable()
export class ProduceService {
  constructor(@InjectRepository(ProduceEntity) private repo: Repository<ProduceEntity>) {}

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(farmerId: string, data: { name: string; price: number; stock: number; imageUrl?: string }) {
    const p = this.repo.create({ farmerId, name: data.name, price: String(data.price), stock: data.stock, imageUrl: data.imageUrl });
    return this.repo.save(p);
  }

  async updateImageUrl(id: string, imageUrl: string) {
    await this.repo.update(id, { imageUrl });
    return this.repo.findOne({ where: { id } });
  }
}
