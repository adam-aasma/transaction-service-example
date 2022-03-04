import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '../entities/client.entity';
import { TransactionEntity } from '../entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(ClientEntity)
    public readonly clients: Repository<ClientEntity>,

    @InjectRepository(TransactionEntity)
    public readonly transactions: Repository<TransactionEntity>,
  ) {}

  async getOrCreateClient(
    clientId: number,
    date: string,
  ): Promise<{
    id: number;
    total_amount_this_month: number;
    fixed_price: number | null;
  }> {
    try {
      const [client]: {
        client_id: number;
        total_amount_this_month: number;
        fixed_price: number | null;
      }[] = await this.clients.manager.query(
        `SELECT c.*, SUM(t.amount_in_eur)  OVER (PARTITION BY t.client_id) total_amount_this_month 
                 FROM clients c
                 LEFT JOIN transactions t ON c.client_id = t.client_id 
                 AND to_char($2::DATE, 'YYYY-MM') = to_char(t.created_at, 'YYYY-MM')
                 WHERE c.client_id=$1`,
        [clientId, date],
      );

      if (client) {
        return {
          id: Number(client.client_id),
          fixed_price: client.fixed_price ? Number(client.fixed_price) : null,
          total_amount_this_month: Number(client.total_amount_this_month),
        };
      }

      const newClient = await this.clients.save({ client_id: clientId });

      return {
        id: newClient.client_id,
        fixed_price: newClient.fixed_price,
        total_amount_this_month: 0,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Database problems, try again later',
      );
    }
  }

  async saveTransaction({
    date: created_at,
    ...dto
  }: {
    client_id: number;
    amount: number;
    amount_in_eur: number;
    currency: string;
    commission: number;
    date: string;
  }) {
    try {
      return this.transactions.save({ created_at, ...dto });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Database problems, try again later',
      );
    }
  }
}
