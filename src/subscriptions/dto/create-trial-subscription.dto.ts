import {
  IsBoolean,
  IsDateString,
  IsDecimal, IsDefined,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength, ValidateIf,
} from 'class-validator';
import {
  BillingPeriod,
  CurrencyCode,
  PaymentMethod,
} from '../entities/subscriptions.entity.js';

export class CreateTrialSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @IsDateString()
  startDate: string;
  
  @IsInt()
  @IsIn([7, 14, 30])
  trialDurationDays: 7 | 14 | 30;

  @IsBoolean()
  renewAfterTrial: boolean;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ValidateIf((dto: CreateTrialSubscriptionDto) => dto.renewAfterTrial)
  @IsEnum(CurrencyCode)
  currency?: CurrencyCode;

  @ValidateIf((dto: CreateTrialSubscriptionDto) => dto.renewAfterTrial)
  @IsDefined()
  @IsDecimal({decimal_digits: '0,2', force_decimal: false})
  @Matches(/^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/)
  price: string;

  @ValidateIf((dto: CreateTrialSubscriptionDto) => dto.renewAfterTrial)
  @IsDefined()
  @IsEnum(BillingPeriod)
  billingPeriod: BillingPeriod;
}
