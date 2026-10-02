import {Controller, Post, Body} from '@nestjs/common';
import {SubscriptionsService} from './subscriptions.service.js';
import {CreateSubscriptionDto} from './dto/create-subscriptions.dto.js';
import {CreateTrialSubscriptionDto} from './dto/create-trial-subscription.dto.js';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {
  }

  @Post()
  createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(createSubscriptionDto);
  }

  @Post('trial')
  createTrialSubscription(
    @Body() createTrialSubscriptionDto: CreateTrialSubscriptionDto,
  ) {
    return this.subscriptionsService.createTrialSubscription(
      createTrialSubscriptionDto,
    );
  }
}
