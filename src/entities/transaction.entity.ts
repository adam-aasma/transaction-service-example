import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { ClientEntity } from './client.entity';

@Entity({
  name: 'transactions',
})
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', default: null })
  commission: number;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'decimal' })
  amount_in_eur: number;

  @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.client_id)
  @JoinColumn({ name: 'client_id' })
  client_id: number;

  @Column({ type: 'date' })
  created_at: string;
}
