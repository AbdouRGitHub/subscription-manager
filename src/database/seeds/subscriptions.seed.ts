import {
  BillingPeriod,
  CurrencyCode,
  PaymentMethod,
  Subscription,
  SubscriptionStatus,
} from '../../subscriptions/entities/subscriptions.entity.js';

export type SubscriptionSeed = Pick<
  Subscription,
  | 'name'
  | 'price'
  | 'currency'
  | 'billingPeriod'
  | 'startDate'
  | 'paymentMethod'
  | 'status'
> &
  Partial<
    Pick<
      Subscription,
      'nextBillingDate' | 'trial_end_date'
    >
  >;

function date(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function createSubscriptionSeeds(): SubscriptionSeed[] {
  return [
    {
      name: 'Netflix Standard',
      price: '13.49',
      currency: CurrencyCode.EUR,
      billingPeriod: BillingPeriod.MONTHLY,
      startDate: date('2026-01-15'),
      nextBillingDate: date('2026-10-15'),
      paymentMethod: PaymentMethod.CARD,
      status: SubscriptionStatus.ACTIVE,
    },
    {
      name: 'Spotify Premium',
      price: '11.12',
      currency: CurrencyCode.EUR,
      billingPeriod: BillingPeriod.MONTHLY,
      startDate: date('2026-03-01'),
      nextBillingDate: date('2026-10-01'),
      paymentMethod: PaymentMethod.PAYPAL,
      status: SubscriptionStatus.ACTIVE,
    },
    {
      name: 'Adobe Creative Cloud',
      price: '779.88',
      currency: CurrencyCode.EUR,
      billingPeriod: BillingPeriod.YEARLY,
      startDate: date('2026-06-10'),
      nextBillingDate: date('2027-06-10'),
      paymentMethod: PaymentMethod.CARD,
      status: SubscriptionStatus.ACTIVE,
    },
    {
      name: 'Notion Plus',
      price: '9.50',
      currency: CurrencyCode.EUR,
      billingPeriod: BillingPeriod.MONTHLY,
      startDate: date('2026-08-20'),
      paymentMethod: PaymentMethod.GOOGLE_PAY,
      status: SubscriptionStatus.PAUSED,
    },
    {
      name: 'OVHcloud VPS',
      price: '95.88',
      currency: CurrencyCode.EUR,
      billingPeriod: BillingPeriod.YEARLY,
      startDate: date('2026-07-05'),
      nextBillingDate: date('2027-07-05'),
      paymentMethod: PaymentMethod.PAYPAL,
      status: SubscriptionStatus.ACTIVE,
    },
    {
      name: 'Basic-Fit Comfort',
      price: '24.99',
      currency: CurrencyCode.EUR,
      billingPeriod: BillingPeriod.MONTHLY,
      startDate: date('2025-09-01'),
        paymentMethod: PaymentMethod.PREPAY_CARD,
      status: SubscriptionStatus.CANCELLED,
    },
    {
      name: 'Le Monde Numérique',
      price: '119.99',
      currency: CurrencyCode.EUR,
      billingPeriod: BillingPeriod.YEARLY,
      startDate: date('2026-09-25'),
      nextBillingDate: date('2026-10-09'),
      trial_end_date: date('2026-10-09'),
      paymentMethod: PaymentMethod.APPLE_PAY,
      status: SubscriptionStatus.TRIAL,
    },
    {
      name: 'iCloud+',
      price: '2.99',
      currency: CurrencyCode.EUR,
      billingPeriod: BillingPeriod.MONTHLY,
      startDate: date('2026-02-12'),
      nextBillingDate: date('2026-10-12'),
      paymentMethod: PaymentMethod.APPLE_PAY,
      status: SubscriptionStatus.ACTIVE,
    },
  ];
}
