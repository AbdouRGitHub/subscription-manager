import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  BillingPeriod,
  CurrencyCode,
  PaymentMethod,
} from '../entities/subscriptions.entity.js';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @IsDecimal({decimal_digits: '0,2', force_decimal: false})
  @Matches(/^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/)
  price: string;

  @IsOptional()
  @IsEnum(CurrencyCode)
  currency?: CurrencyCode;

  @IsEnum(BillingPeriod)
  billingPeriod: BillingPeriod;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}
