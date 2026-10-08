import {Controller, Post, Body, Patch, Param, ParseUUIDPipe, Get, Query} from '@nestjs/common';
import {SubscriptionsService} from './subscriptions.service.js';
import {CreateSubscriptionDto} from './dto/create-subscriptions.dto.js';
import {CreateTrialSubscriptionDto} from './dto/create-trial-subscription.dto.js';
import {UpdateSubscriptionsDto} from "./dto/update-subscriptions.dto.js";
import {SubscriptionsPaginationDto} from "./dto/subscriptions.pagination.js";

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

  @Get()
  findAllSubscriptions(@Query() query: SubscriptionsPaginationDto) {
    return this.subscriptionsService.findAllSubscriptions(query);
  }

  @Patch(':id')
  updateSubscription(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionsDto) {
    return this.subscriptionsService.updateSubscription(id, updateSubscriptionDto);
  }

  @Patch('cancel/:id')
  cancelSubscription(@Param('id') id: string, @Body() body: { cancel: "immediate" | "period_end" }) {
    return this.subscriptionsService.cancelSubscription(id, body);
  }
}
