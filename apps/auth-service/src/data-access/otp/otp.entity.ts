import {
  Entity,
  ManyToOne,
  Property,
  Enum,
  PrimaryKey,
} from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';
import { v4 } from 'uuid';
import { EntityRepositoryType } from '@mikro-orm/core';
import { OtpRepository } from './otp.repository';
import { OtpStatus, OtpType } from './otp.enum';

@Entity({ tableName: 'user_otps', repository: () => OtpRepository })
export class Otp extends BaseEntity<Otp> {
  [EntityRepositoryType]?: OtpRepository;
  @ManyToOne({ entity: () => User, deleteRule: 'cascade' })
  user: User;

  @PrimaryKey({ type: 'uuid', fieldName: 'otp_id' })
  otpId: string = v4();

  @Property({ type: 'text' })
  code: string;

  @Enum({ items: () => OtpType, default: OtpType.VERIFY_EMAIL })
  type: OtpType = OtpType.VERIFY_EMAIL;

  @Enum({ items: () => OtpStatus, default: OtpStatus.PENDING })
  status: OtpStatus = OtpStatus.PENDING;

  @Property({ type: 'datetime' })
  expiresAt: Date;

  @Property({ type: 'json', nullable: true })
  metadata?: any;
}
