import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Subscriptions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100})
  name: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2
  })
  amount: string;

  @Column({
    default: 'EUR'
  })
  currency: string;

  @Column({
    length: 30
  })
  billingCycle: string;

  @Column({
    default: 'active'
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
