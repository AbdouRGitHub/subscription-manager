import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsDto } from './create-subscriptions.dto.js';

export class UpdateSubscriptionsDto extends PartialType(CreateSubscriptionsDto) {}
