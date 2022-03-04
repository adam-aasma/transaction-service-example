import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { ExchangeRateModule } from '../exchange-rates/exchange-rates.module';
import { ClientEntity } from '../entities/client.entity';
import { CommissionCalculator } from './commision-calculator.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity, TransactionEntity]),
    ExchangeRateModule,
  ],
  providers: [TransactionService, TransactionRepository, CommissionCalculator],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
