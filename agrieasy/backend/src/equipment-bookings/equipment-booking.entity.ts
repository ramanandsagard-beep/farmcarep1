import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'equipment_bookings' })
export class EquipmentBookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'equipment_id' })
  equipmentId!: string;

  @Column({ name: 'farmer_id' })
  farmerId!: string;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime!: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime!: Date;

  @Column({ default: 'PENDING' })
  status!: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
