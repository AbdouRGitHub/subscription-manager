import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsDto } from './dto/create-subscriptions.dto.js';
import { UpdateSubscriptionsDto } from './dto/update-subscriptions.dto.js';

@Injectable()
export class SubscriptionsService {
  create(createSubscriptionsDto: CreateSubscriptionsDto) {
    return 'This action adds new subscriptions';
  }

  findAll() {
    return `This action returns all subscriptions`;
  }

  findOne(id: number) {
    return `This action returns #${id} subscriptions`;
  }

  update(id: number, updateSubscriptionsDto: UpdateSubscriptionsDto) {
    return `This action updates #${id} subscriptions`;
  }

  remove(id: number) {
    return `This action removes #${id} subscriptions`;
  }
}
