import { Column, OneToMany, Entity, PrimaryColumn } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity({
  name: 'clients',
})
export class ClientEntity {
  @PrimaryColumn({
    type: 'bigint',
  })
  client_id: number;

  @Column({ type: 'decimal', default: null })
  fixed_price: number | null;

  @OneToMany(
    () => TransactionEntity,
    (TransactionEntity) => TransactionEntity.client_id,
  )
  transactions: TransactionEntity[];
}
