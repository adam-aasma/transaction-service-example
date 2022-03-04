import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExchangeRateService {
  async getEuroRate(currency: string, date: string): Promise<number> {
    let rates: Record<string, number>;
    try {
      const resp = await axios.get<{ rates: Record<string, number> }>(
        `https://api.exchangerate.host/${date}`,
      );
      rates = resp.data.rates;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get exchange rates, try again later`,
      );
    }

    const rate = rates[currency];
    if (!rate) {
      throw new BadRequestException(
        `Currently we are not supporting payments with ${currency}`,
      );
    }

    return rate;
  }
}
