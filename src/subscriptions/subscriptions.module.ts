import {Module} from '@nestjs/common';
import {SubscriptionsService} from './subscriptions.service.js';
import {SubscriptionsController} from './subscriptions.controller.js';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Subscription} from "./entities/subscriptions.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {
}
