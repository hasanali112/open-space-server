import {
  Entity,
  Filter,
  Index,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { EntityRepositoryType } from '@mikro-orm/core';
import { UserRepository } from './user.repository';
import { BaseEntity } from '../base.entity';
import { v4 } from 'uuid';

@Filter({
  name: 'softDelete',
  cond: () => ({ deletedAt: null }),
  default: true,
})
@Index({ properties: ['email', 'phoneNumber'] })
@Entity({
  tableName: 'users',
  repository: () => UserRepository,
})
export class User extends BaseEntity<User> {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey({ type: 'uuid', fieldName: 'user_id' })
  userId: string = v4();

  @Property({ type: 'text', unique: true, nullable: true })
  email?: string;

  @Property({
    type: 'text',
    fieldName: 'phone_number',
    unique: true,
    nullable: true,
  })
  phoneNumber?: string;

  @Property({ type: 'text', nullable: false })
  password: string;

  @Property({ type: 'boolean', fieldName: 'is_verified', default: false })
  isVerified: boolean = false;

  @Property({ type: 'boolean', fieldName: 'is_blocked', default: false })
  isBlocked: boolean = false;

  @Property({ type: 'boolean', fieldName: 'is_deleted', default: false })
  isDeleted: boolean = false;
}
