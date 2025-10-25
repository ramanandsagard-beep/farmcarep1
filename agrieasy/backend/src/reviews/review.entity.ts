import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'user_id' }) userId!: string;
  @Column({ name: 'entity_type' }) entityType!: 'EQUIPMENT'|'INPUT'|'PRODUCE'|'VEHICLE'|'ORDER';
  @Column({ name: 'entity_id' }) entityId!: string;
  @Column() rating!: number;
  @Column({ nullable: true }) comment?: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
}
