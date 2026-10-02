import {Injectable} from '@nestjs/common';
import {CreateSubscriptionDto} from './dto/create-subscriptions.dto.js';
import {CreateTrialSubscriptionDto} from './dto/create-trial-subscription.dto.js';
import {InjectRepository} from '@nestjs/typeorm';
import {
  BillingPeriod,
  Subscription,
  SubscriptionStatus,
} from './entities/subscriptions.entity.js';
import {Repository} from 'typeorm';
import {addDays, addMonths, addYears, parseISO} from 'date-fns';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {
  }

  createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto
    );
    subscription.startDate = parseISO(createSubscriptionDto.startDate);
    subscription.nextBillingDate =
      subscription.billingPeriod === BillingPeriod.MONTHLY
        ? addMonths(subscription.startDate, 1)
        : addYears(subscription.startDate, 1);

    return this.subscriptionRepository.save(subscription);
  }

  async createTrialSubscription(
    createTrialSubscriptionDto: CreateTrialSubscriptionDto,
  ) {
    const subscription = this.subscriptionRepository.create(createTrialSubscriptionDto);
    return this.subscriptionRepository.save(subscription);
  }
}
