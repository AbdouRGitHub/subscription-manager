import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum CurrencyCode {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  CHF = 'CHF',
  JPY = 'JPY'
}

export enum PaymentMethod {
  CARD = 'card',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  PREPAY_CARD = 'prepay_card',
  OTHER = 'other',
}

export enum BillingPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity({name: 'subscriptions'})
export class Subscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({length: 250})
  name: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  price: string;

  @Column({
    enum: CurrencyCode,
    default: CurrencyCode.EUR,
  })
  currency: string;

  @Column({
    type: 'enum',
    enum: BillingPeriod,
    nullable: true,
  })
  billingPeriod: BillingPeriod;

  @Column()
  startDate: Date;

  @Column({
    nullable: true,
  })
  nextBillingDate: Date;

  @Column({default: false})
  renewAfterTrial: boolean;

  @Column({
    nullable: true,
  })
  trial_end_date: Date;

  @Column({
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
