import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InputProductEntity } from './input-product.entity';

@Injectable()
export class InputsService {
  constructor(@InjectRepository(InputProductEntity) private repo: Repository<InputProductEntity>) {}

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(supplierId: string, data: { name: string; category: 'FERTILIZER'|'PESTICIDE'|'OTHER'; price: number; stock: number; imageUrl?: string }) {
    const p = this.repo.create({ supplierId, name: data.name, category: data.category, price: String(data.price), stock: data.stock, imageUrl: data.imageUrl });
    return this.repo.save(p);
  }

  async updateImageUrl(id: string, imageUrl: string) {
    await this.repo.update(id, { imageUrl });
    return this.repo.findOne({ where: { id } });
  }
}
