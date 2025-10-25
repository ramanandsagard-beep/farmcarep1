import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order_items' })
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'order_id' }) orderId!: string;
  @Column({ name: 'item_type' }) itemType!: 'INPUT' | 'PRODUCE';
  @Column({ name: 'item_id' }) itemId!: string;
  @Column() quantity!: number;
  @Column({ type: 'numeric' }) price!: string;
}
