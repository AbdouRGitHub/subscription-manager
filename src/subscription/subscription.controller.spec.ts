import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller.js';
import { SubscriptionService } from './subscription.service.js';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [SubscriptionService],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
