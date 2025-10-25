import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemEntity } from './cart-item.entity';

@Injectable()
export class CartService {
  constructor(@InjectRepository(CartItemEntity) private repo: Repository<CartItemEntity>) {}

  list(userId: string) { return this.repo.find({ where: { userId } }); }

  async add(userId: string, itemType: 'INPUT'|'PRODUCE', itemId: string, quantity: number) {
    const existing = await this.repo.findOne({ where: { userId, itemType, itemId } });
    if (existing) { existing.quantity += quantity; return this.repo.save(existing); }
    const item = this.repo.create({ userId, itemType, itemId, quantity });
    return this.repo.save(item);
  }

  async clear(userId: string) { await this.repo.delete({ userId }); }
}
