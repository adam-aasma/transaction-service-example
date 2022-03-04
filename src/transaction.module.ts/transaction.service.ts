import { Injectable } from '@nestjs/common';
import { ExchangeRateService } from '../exchange-rates/exchange-rates.service';
import { CommissionCalculator } from './commision-calculator.service';
import { CreateTransactionDto } from './transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionResponse } from './transaction.types';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly feeCalculator: CommissionCalculator,
  ) {}

  async submitTransaction({
    amount,
    currency,
    date,
    client_id,
  }: CreateTransactionDto): Promise<CreateTransactionResponse> {
    let amount_in_eur: number;
    if (currency.toUpperCase() !== 'EUR') {
      const rate = await this.exchangeRateService.getEuroRate(
        currency.toUpperCase(),
        date,
      );
      amount_in_eur = Number(amount) / rate;
    } else {
      amount_in_eur = Number(amount);
    }

    const { total_amount_this_month, fixed_price } =
      await this.transactionRepository.getOrCreateClient(client_id, date);

    const commission = this.feeCalculator.calculateFee(
      { total_amount_this_month, fixed_price },
      amount_in_eur,
    );

    await this.transactionRepository.saveTransaction({
      client_id,
      amount: Number(amount),
      currency,
      amount_in_eur,
      commission,
      date,
    });

    return {
      amount: String(commission),
      currency: 'EUR',
    };
  }
}
