import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service.js';
import { SubscriptionController } from './subscription.controller.js';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
