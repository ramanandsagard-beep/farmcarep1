import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity) private orders: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity) private orderItems: Repository<OrderItemEntity>,
    private cart: CartService,
  ) {}

  async checkout(userId: string) {
    const cartItems = await this.cart.list(userId);
    let total = 0;
    const order = await this.orders.save(this.orders.create({ userId, status: 'CREATED', totalAmount: '0' }));

    for (const ci of cartItems) {
      let price = 0;
      try {
        if (ci.itemType === 'PRODUCE') {
          const produceRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/produce/${ci.itemId}`);
          const produce = await produceRes.json();
          price = parseFloat(produce.price) || 0;
        } else if (ci.itemType === 'INPUT') {
          const inputRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/inputs/${ci.itemId}`);
          const input = await inputRes.json();
          price = parseFloat(input.price) || 0;
        }
      } catch (error) {
        console.error('Failed to fetch price for', ci.itemType, ci.itemId, error);
        price = 100; // fallback price
      }

      total += price * ci.quantity;
      await this.orderItems.save(this.orderItems.create({
        orderId: order.id,
        itemType: ci.itemType,
        itemId: ci.itemId,
        quantity: ci.quantity,
        price: String(price)
      }));
    }

    order.totalAmount = String(total);
    await this.orders.save(order);
    await this.cart.clear(userId);
    return order;
  }

  getById(id: string) { return this.orders.findOne({ where: { id } }); }

  async updateStatus(id: string, status: 'SHIPPED'|'DELIVERED'|'CANCELLED') {
    const order = await this.getById(id);
    if (!order) return null;
    order.status = status;
    await this.orders.save(order);
    return order;
  }
}
