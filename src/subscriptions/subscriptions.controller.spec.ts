import {Test, TestingModule} from '@nestjs/testing';
import {SubscriptionsController} from './subscriptions.controller.js';
import {SubscriptionsService} from './subscriptions.service.js';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Subscription} from "./entities/subscriptions.entity.js";


const mockRepository = {
  create: vi.fn(),
  save: vi.fn(),
}

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [SubscriptionsService, {
        provide: getRepositoryToken(Subscription),
        useValue: mockRepository,
      }],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
