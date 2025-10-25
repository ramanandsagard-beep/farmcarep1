import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'produce' })
export class ProduceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'farmer_id' })
  farmerId!: string;

  @Column()
  name!: string;

  @Column({ type: 'numeric' })
  price!: string;

  @Column()
  stock!: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
