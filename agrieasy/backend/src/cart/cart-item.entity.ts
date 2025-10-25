import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'cart_items' })
@Unique(['userId', 'itemType', 'itemId'])
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'item_type' })
  itemType!: 'INPUT' | 'PRODUCE';

  @Column({ name: 'item_id' })
  itemId!: string;

  @Column()
  quantity!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
