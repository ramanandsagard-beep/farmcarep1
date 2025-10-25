import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notifications' })
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'user_id' }) userId!: string;
  @Column() title!: string;
  @Column() message!: string;
  @Column() type!: 'SMS' | 'EMAIL' | 'PUSH';
  @Column({ name: 'is_read' }) isRead!: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
}
