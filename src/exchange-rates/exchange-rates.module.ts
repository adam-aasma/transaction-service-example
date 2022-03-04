import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rates.service';

@Module({
  providers: [ExchangeRateService],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
