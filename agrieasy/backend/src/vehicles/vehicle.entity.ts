import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vehicles' })
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'transporter_id' })
  transporterId!: string;

  @Column({ name: 'vehicle_type' })
  vehicleType!: string;

  @Column({ name: 'capacity_kg' })
  capacityKg!: number;

  @Column({ name: 'plate_number', unique: true })
  plateNumber!: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
