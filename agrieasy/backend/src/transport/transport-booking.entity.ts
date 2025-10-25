import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transport_bookings' })
export class TransportBookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'vehicle_id' })
  vehicleId!: string;

  @Column({ name: 'farmer_id' })
  farmerId!: string;

  @Column()
  source!: string;

  @Column()
  destination!: string;

  @Column({ name: 'pickup_time', type: 'timestamptz' })
  pickupTime!: Date;

  @Column({ name: 'drop_time', type: 'timestamptz' })
  dropTime!: Date;

  @Column({ default: 'REQUESTED' })
  status!: 'REQUESTED' | 'ACCEPTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
