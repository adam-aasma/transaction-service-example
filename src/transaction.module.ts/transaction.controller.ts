import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTransactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';
import { CreateTransactionResponse } from './transaction.types';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTransaction(
    @Body() dto: CreateTransactionDto,
  ): Promise<CreateTransactionResponse> {
    const resp = await this.transactionService.submitTransaction(dto);
    return resp;
  }
}
