import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { OrdersService } from '../orders/orders.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity) private repo: Repository<PaymentEntity>,
    private orders: OrdersService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async mockPay(orderId: string) {
    const order = await this.orders.getById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    await this.dataSource.transaction(async (manager) => {
      await manager.update('orders', { id: orderId }, { status: 'PAID' });
      await manager.insert('payments', { order_id: orderId, provider: 'RAZORPAY_MOCK', status: 'PAID', amount: order.totalAmount });
    });
    return { success: true };
  }
}
