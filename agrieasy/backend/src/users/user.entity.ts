import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  phone!: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  role!: 'FARMER' | 'EQUIPMENT_VENDOR' | 'INPUT_SUPPLIER' | 'TRANSPORTER' | 'CONSUMER' | 'ADMIN';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
