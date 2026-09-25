import { Subscriptions } from '../../subscriptions/entities/subscriptions.entity.js';

export type SubscriptionSeed = Pick<
  Subscriptions,
  'name' | 'amount' | 'currency' | 'billingCycle' | 'status'
>;

export function createSubscriptionSeeds(): SubscriptionSeed[] {
  return [
    {
      name: 'Netflix Standard',
      amount: '13.49',
      currency: 'EUR',
      billingCycle: 'monthly',
      status: 'active',
    },
    {
      name: 'Spotify Premium',
      amount: '11.12',
      currency: 'EUR',
      billingCycle: 'monthly',
      status: 'active',
    },
    {
      name: 'Adobe Creative Cloud',
      amount: '779.88',
      currency: 'EUR',
      billingCycle: 'yearly',
      status: 'active',
    },
    {
      name: 'Notion Plus',
      amount: '9.50',
      currency: 'EUR',
      billingCycle: 'monthly',
      status: 'paused',
    },
    {
      name: 'OVHcloud VPS',
      amount: '95.88',
      currency: 'EUR',
      billingCycle: 'yearly',
      status: 'active',
    },
    {
      name: 'Basic-Fit Comfort',
      amount: '24.99',
      currency: 'EUR',
      billingCycle: 'monthly',
      status: 'cancelled',
    },
    {
      name: 'Le Monde Numérique',
      amount: '119.99',
      currency: 'EUR',
      billingCycle: 'yearly',
      status: 'active',
    },
    {
      name: 'iCloud+',
      amount: '2.99',
      currency: 'EUR',
      billingCycle: 'monthly',
      status: 'active',
    },
  ];
}
