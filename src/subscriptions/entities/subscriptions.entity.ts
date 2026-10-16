import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
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

export enum Category {
  NOTHING = 'nothing',
  ENTERTAINMENT = 'entertainment',
  FOOD = 'food',
  SPORTS = 'sports',
  HEALTH = 'health',
  EDUCATION = 'education',
  GAMING = 'gaming',
  TRAVEL = 'travel',
  LIFESTYLE = 'lifestyle',
  MUSIC = 'music',
  CINEMA = 'cinema'
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
  price: string | null;

  @Column({
    type: 'enum',
    enum: CurrencyCode,
    default: CurrencyCode.EUR,
  })
  currency: CurrencyCode;

  @Column({
    type: 'enum',
    enum: Category,
    default: Category.NOTHING,
  })
  category: Category;

  @Column({
    type: 'enum',
    enum: BillingPeriod,
    nullable: true,
  })
  billingPeriod: BillingPeriod | null;

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
  trialEndDate: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({default: false})
  cancelAtPeriodEnd: boolean;

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
