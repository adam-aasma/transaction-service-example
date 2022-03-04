import { Injectable } from '@nestjs/common';

@Injectable()
export class CommissionCalculator {
  calculateFee(
    clientData: { total_amount_this_month: number; fixed_price: number | null },
    amount: number,
  ): number {
    const fee = Math.min(
      this.defaultPrice(amount),
      this.highTurnover(clientData.total_amount_this_month),
      clientData.fixed_price || Infinity,
    );

    return Math.round(fee * 100) / 100;
  }

  private defaultPrice(amount: number): number {
    const fee = amount * 0.005;
    return fee > 0.05 ? fee : 0.05;
  }

  private highTurnover(totalSumThisMonth: number): number {
    if (totalSumThisMonth >= 1000) {
      return 0.03;
    } else {
      return Infinity;
    }
  }
}
