import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionDto } from './create-subscriptions.dto.js';

export class UpdateSubscriptionsDto extends PartialType(CreateSubscriptionDto) {}
