import { Test } from '@nestjs/testing';
import { CommissionCalculator } from './commision-calculator.service';

describe('FeeCalculator', () => {
  let feeCalculator: CommissionCalculator;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CommissionCalculator],
    }).compile();

    feeCalculator = moduleRef.get<CommissionCalculator>(CommissionCalculator);
  });

  describe('calculateFee', () => {
    test.each([
      [{ total_amount_this_month: 0, fixed_price: 0.05, amount: 2000.0 }, 0.05],
      [{ total_amount_this_month: 0, fixed_price: null, amount: 500.0 }, 2.5],
      [{ total_amount_this_month: 500, fixed_price: null, amount: 499.0 }, 2.5],
      [{ total_amount_this_month: 999, fixed_price: null, amount: 100.0 }, 0.5],
      [{ total_amount_this_month: 1099, fixed_price: null, amount: 1.0 }, 0.03],
      [{ total_amount_this_month: 0, fixed_price: null, amount: 500.0 }, 2.5],
    ])(
      'Calculates fee correctly for %s',
      ({ amount, ...clientData }, output) => {
        expect(feeCalculator.calculateFee(clientData, amount)).toBe(output);
      },
    );
  });
});
