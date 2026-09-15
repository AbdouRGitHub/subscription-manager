import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SubscriptionModule } from './subscription/subscription.module.js';

@Module({
  imports: [SubscriptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
