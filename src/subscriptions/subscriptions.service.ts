import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateSubscriptionDto} from './dto/create-subscriptions.dto.js';
import {CreateTrialSubscriptionDto} from './dto/create-trial-subscription.dto.js';
import {InjectRepository} from '@nestjs/typeorm';
import {
  BillingPeriod,
  Subscription,
  SubscriptionStatus,
} from './entities/subscriptions.entity.js';
import {LessThanOrEqual, Repository} from 'typeorm';
import {addDays, addMonths, addYears, differenceInCalendarDays, parseISO} from 'date-fns';
import {Cron, CronExpression} from "@nestjs/schedule";
import {UpdateSubscriptionsDto} from "./dto/update-subscriptions.dto.js";
import {SubscriptionsPaginationDto} from "./dto/subscriptions.pagination.js";

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {
  }

  /*Créer un abonnement mensuel ou annuel*/
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

  /*Créer un essai gratuit (avec renouvellement automatique ou non)*/
  createTrialSubscription(
    createTrialSubscriptionDto: CreateTrialSubscriptionDto,
  ) {
    const subscription = this.subscriptionRepository.create(createTrialSubscriptionDto);
    subscription.startDate = parseISO(createTrialSubscriptionDto.startDate);
    subscription.trial_end_date = addDays(
      subscription.startDate,
      createTrialSubscriptionDto.trialDurationDays,
    );
    subscription.status = SubscriptionStatus.TRIAL;
    return this.subscriptionRepository.save(subscription);
  }

  /*Récupérer les abonnements avec pagination*/
  async findAllSubscriptions(query: SubscriptionsPaginationDto) {
    const {page = 1, limit = 10, order = 'DESC'} = query;
    const [data, total] = await this.subscriptionRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: order
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /*Mettre à jour un abonnement*/
  async updateSubscription(id: string, updateSubscriptionDto: UpdateSubscriptionsDto) {
    return this.subscriptionRepository.save({id, ...updateSubscriptionDto});
  }

  /*Annuler un abonnement (à la fin du prochain cycle de facturation ou immédiatement)*/
  async cancelSubscription(id: string, body: { cancel: "immediate" | "period_end" }) {
    const subscription = await this.subscriptionRepository.findOneBy({id});
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (body.cancel === "immediate") {
      subscription.status = SubscriptionStatus.CANCELLED;
    } else if (body.cancel === "period_end") {
      subscription.cancelAtPeriodEnd = true;
    }
    return this.subscriptionRepository.save(subscription);
  }

  /*Gestion des abonnements à la fin de la période d'essai*/
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleTrialSubscriptionEnding() {
    const criterias = {
      status: SubscriptionStatus.TRIAL,
      renewAfterTrial: true,
      trial_end_date: LessThanOrEqual(new Date()),
    };
    const subscriptions = await this.subscriptionRepository.find({where: criterias});

    for (const subscription of subscriptions) {
      const nextBillingDate =
        subscription.billingPeriod === BillingPeriod.MONTHLY
          ? addMonths(subscription.trial_end_date, 1)
          : addYears(subscription.trial_end_date, 1);

      await this.subscriptionRepository.update(
        {id: subscription.id, ...criterias},
        {status: SubscriptionStatus.ACTIVE, nextBillingDate},
      );
    }
  }

  /*Gestion du renouvellement automatique*/
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionRenewal() {
    const criterias = {
      status: SubscriptionStatus.ACTIVE,
      nextBillingDate: LessThanOrEqual(new Date()),
      cancelAtPeriodEnd: false,
    }

    const subscriptions = await this.subscriptionRepository.find({where: criterias});

    for (const subscription of subscriptions) {
      const nextBillingDate =
        subscription.billingPeriod === BillingPeriod.MONTHLY
          ? addMonths(subscription.nextBillingDate, 1)
          : addYears(subscription.nextBillingDate, 1);

      await this.subscriptionRepository.update(
        {id: subscription.id, ...criterias},
        {nextBillingDate},
      );
    }
  }
}
