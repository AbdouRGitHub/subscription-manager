import {Module} from '@nestjs/common';
import {AppController} from './app.controller.js';
import {AppService} from './app.service.js';
import {SubscriptionsModule} from './subscriptions/subscriptions.module.js';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {databaseOptions} from "./database/data-source.js";
import {ScheduleModule} from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(databaseOptions),
    SubscriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
