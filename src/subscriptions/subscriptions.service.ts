import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateSubscriptionDto} from './dto/create-subscriptions.dto.js';
import {CreateTrialSubscriptionDto} from './dto/create-trial-subscription.dto.js';
import {InjectRepository} from '@nestjs/typeorm';
import {
  BillingPeriod,
  Subscription,
  SubscriptionStatus,
} from './entities/subscriptions.entity.js';
import {IsNull, LessThanOrEqual, MoreThan, Not, Repository} from 'typeorm';
import {addDays, addMonths, addYears, format, parseISO, startOfYear} from 'date-fns';
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
    subscription.trialEndDate = addDays(
      subscription.startDate,
      createTrialSubscriptionDto.trialDurationDays,
    );
    subscription.status = SubscriptionStatus.TRIAL;
    return this.subscriptionRepository.save(subscription);
  }

  /* Récupère les statistiques d'aperçu */
  async getOverviewStats() {
    const activeSubscriptions: number = await this.subscriptionRepository.countBy({status: SubscriptionStatus.ACTIVE});
    const trialSubscriptions: number = await this.subscriptionRepository.countBy({status: SubscriptionStatus.TRIAL});

    const mostExpensiveSubscription = await this.subscriptionRepository.find({
      where: {status: SubscriptionStatus.ACTIVE, price: Not(IsNull())},
      select: {name: true, price: true, currency: true},
      order: {price: 'DESC'},
      take: 1,
    });

    const nextDeadlines = await this.subscriptionRepository.find({
      where: {
        nextBillingDate: MoreThan(new Date()),
      },
      order: {nextBillingDate: 'ASC'},
      take: 5,
    });

    // Le mois de début compte entièrement ; projection des actifs jusqu'à décembre.
    const yearStart = startOfYear(new Date());
    const nextYearStart = addYears(yearStart, 1);
    const [expenses]: [{ total: string }] = await this.subscriptionRepository.query(`
        SELECT ROUND(COALESCE(SUM(
                                      price
                                          * (13 - EXTRACT(MONTH FROM GREATEST("startDate", $1::timestamp)))
                                          / CASE "billingPeriod"
                                                WHEN $4 THEN 1
                                                WHEN $5 THEN 12
                                          END
                              ), 0), 2) ::text AS total
        FROM subscriptions
        WHERE status = $3
          AND price IS NOT NULL
          AND "startDate" < $2::timestamp
    `, [
      format(yearStart, 'yyyy-MM-dd'),
      format(nextYearStart, 'yyyy-MM-dd'),
      SubscriptionStatus.ACTIVE,
      BillingPeriod.MONTHLY,
      BillingPeriod.YEARLY,
    ]);

    const annualExpenses = Number(expenses.total);

    const monthlyCategoryRows: Array<{
      category: Subscription['category'];
      amount: string;
      percentage: string;
    }> = await this.subscriptionRepository.query(`
        WITH category_totals AS (SELECT category,
                                        SUM(CASE "billingPeriod"
                                                WHEN $2 THEN price
                                                WHEN $3 THEN price / 12
                                                ELSE 0
                                            END) AS amount
                                 FROM subscriptions
                                 WHERE status = $1
                                   AND price IS NOT NULL
                                   AND "startDate" <= $4:: timestamp
        GROUP BY category
            )
        SELECT category,
               ROUND(amount, 2)::text AS amount, ROUND(amount * 100 / SUM(amount) OVER (), 2) ::text AS percentage
        FROM category_totals
        WHERE amount > 0
        ORDER BY amount DESC, category
    `, [
      SubscriptionStatus.ACTIVE,
      BillingPeriod.MONTHLY,
      BillingPeriod.YEARLY,
      format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    ]);

    const monthlyExpensesByCategory = (monthlyCategoryRows ?? []).map(row => ({
      category: row.category,
      amount: Number(row.amount),
      percentage: Number(row.percentage),
    }));

    return {
      activeSubscriptions,
      trialSubscriptions,
      annualExpenses,
      monthlyExpensesByCategory,
      mostExpensiveSubscription,
      nextDeadlines,
    };
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
          ? addMonths(subscription.trialEndDate, 1)
          : addYears(subscription.trialEndDate, 1);

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
