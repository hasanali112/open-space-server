import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v4 } from 'uuid';

export abstract class BaseEntity<T = any> {
  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  @Property({ type: 'datetime', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: 'datetime', nullable: true })
  deletedAt?: Date;
}
