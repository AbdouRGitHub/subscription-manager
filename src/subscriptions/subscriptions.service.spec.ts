import {Test, TestingModule} from '@nestjs/testing';
import {SubscriptionsService} from './subscriptions.service.js';
import {BillingPeriod, CurrencyCode, PaymentMethod, Subscription, SubscriptionStatus} from "./entities/subscriptions.entity.js";
import {getRepositoryToken} from "@nestjs/typeorm";
import {CreateSubscriptionDto} from "./dto/create-subscriptions.dto.js";

const monthlySubscriptionDtoMock: CreateSubscriptionDto = {
  name: "Mon abonnement mensuel",
  price: "9.99",
  currency: CurrencyCode.EUR,
  billingPeriod: BillingPeriod.MONTHLY,
  startDate: "2026-10-09",
  paymentMethod: PaymentMethod.CARD
}



const annualSubscriptionDtoMock: CreateSubscriptionDto = {
  name: "Mon abonnement annuel",
  price: "99.99",
  currency: CurrencyCode.EUR,
  billingPeriod: BillingPeriod.YEARLY,
  startDate: "2026-10-01",
  paymentMethod: PaymentMethod.PAYPAL
}

const mockRepository = {
  create: vi.fn(),
  save: vi.fn(),
}

const savedFields = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  renewAfterTrial: false,
  cancelAtPeriodEnd: false,
  status: SubscriptionStatus.ACTIVE,
  createdAt: new Date('2026-10-08T12:00:00Z'),
  updatedAt: new Date('2026-10-08T12:00:00Z'),
};

const saveSubscriptionMock = async (subscription: Subscription) =>
  ({...subscription, ...savedFields});

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionsService, {
        provide: getRepositoryToken(Subscription),
        useValue: mockRepository,
      },],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create a subscription', () => {
    it('should create a monthly subscription', async () => {
      const subscription = {...monthlySubscriptionDtoMock};
      mockRepository.create.mockReturnValue(subscription);
      mockRepository.save.mockImplementationOnce(saveSubscriptionMock);

      const result = await service.createSubscription(monthlySubscriptionDtoMock);

      expect(mockRepository.create).toHaveBeenCalledWith(monthlySubscriptionDtoMock);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...monthlySubscriptionDtoMock,
        startDate: new Date(2026, 9, 9),
        nextBillingDate: new Date(2026, 10, 9),
      });
      expect(result).toEqual({
        ...monthlySubscriptionDtoMock,
        startDate: new Date(2026, 9, 9),
        nextBillingDate: new Date(2026, 10, 9),
        ...savedFields,
      });
    });
    it('should create a annual subscriptions', async () => {
      const subscription = {...annualSubscriptionDtoMock};
      mockRepository.create.mockReturnValue(subscription);
      mockRepository.save.mockImplementationOnce(saveSubscriptionMock);

      const result = await service.createSubscription(annualSubscriptionDtoMock);

      expect(mockRepository.create).toHaveBeenCalledWith(annualSubscriptionDtoMock);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...annualSubscriptionDtoMock,
        startDate: new Date(2026, 9, 1),
        nextBillingDate: new Date(2027, 9, 1),
      });
      expect(result).toEqual({
        ...annualSubscriptionDtoMock,
        startDate: new Date(2026, 9, 1),
        nextBillingDate: new Date(2027, 9, 1),
        ...savedFields,
      });
    });

    describe("get subscriptions", () => {

    })
  });
});
