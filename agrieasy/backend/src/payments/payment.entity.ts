import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'order_id' }) orderId!: string;
  @Column() provider!: string;
  @Column() status!: 'CREATED'|'PAID'|'FAILED'|'REFUNDED';
  @Column({ type: 'numeric' }) amount!: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
}
