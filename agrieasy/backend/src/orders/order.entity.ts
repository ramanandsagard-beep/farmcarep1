import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'user_id' }) userId!: string;
  @Column() status!: 'CREATED'|'PAID'|'SHIPPED'|'DELIVERED'|'CANCELLED';
  @Column({ name: 'total_amount', type: 'numeric' }) totalAmount!: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
}
