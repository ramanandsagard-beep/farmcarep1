import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'input_products' })
export class InputProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'supplier_id' })
  supplierId!: string;

  @Column()
  name!: string;

  @Column()
  category!: 'FERTILIZER' | 'PESTICIDE' | 'OTHER';

  @Column({ type: 'numeric' })
  price!: string;

  @Column()
  stock!: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
