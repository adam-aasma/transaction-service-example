import { IsNumber, IsNumberString, IsPositive } from 'class-validator';
import {
  IsCurrencyAlpha3Code,
  IsPositiveNumberString,
  IsValidDateString,
} from '../utils/validation-decorators';

export class CreateTransactionDto {
  @IsValidDateString()
  date: string;

  @IsPositiveNumberString()
  @IsNumberString()
  amount: string;

  @IsNumber()
  @IsPositive()
  client_id: number;

  @IsCurrencyAlpha3Code()
  currency: string;
}
