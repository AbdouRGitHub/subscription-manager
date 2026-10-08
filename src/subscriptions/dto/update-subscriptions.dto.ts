import {PartialType} from '@nestjs/mapped-types';
import {CreateSubscriptionDto} from './create-subscriptions.dto.js';
import {IsBoolean, IsIn, IsOptional} from "class-validator";

export class UpdateSubscriptionsDto extends PartialType(CreateSubscriptionDto) {
  @IsOptional()
  @IsIn([7, 14, 30])
  trialDurationDays?: 7 | 14 | 30;

  @IsOptional()
  @IsBoolean()
  renewAfterTrial?: boolean;
}
