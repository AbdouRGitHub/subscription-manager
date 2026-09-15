import {Module} from '@nestjs/common';
import {AppController} from './app.controller.js';
import {AppService} from './app.service.js';
import {SubscriptionModule} from './subscription/subscription.module.js';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {databaseOptions} from "./database/data-source.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(databaseOptions),
    SubscriptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
