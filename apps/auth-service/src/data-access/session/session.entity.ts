import { Entity, ManyToOne, Property, PrimaryKey } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';
import { EntityRepositoryType } from '@mikro-orm/core';
import { SessionRepository } from './session.repository';
import { v4 } from 'uuid';

@Entity({ tableName: 'user_sessions', repository: () => SessionRepository })
export class Session extends BaseEntity<Session> {
  [EntityRepositoryType]?: SessionRepository;
  @ManyToOne({ entity: () => User, deleteRule: 'cascade' })
  user: User;

  @PrimaryKey({ type: 'uuid', fieldName: 'session_id' })
  sessionId: string = v4();

  @Property({ type: 'text', index: true, fieldName: 'refresh_token_hash' })
  refreshTokenHash: string;

  @Property({ type: 'uuid', index: true, fieldName: 'family_id' })
  familyId: string;

  @Property({ type: 'boolean', default: false, fieldName: 'is_used' })
  isUsed: boolean = false;

  @Property({ type: 'text', nullable: true, fieldName: 'device_id' })
  deviceId?: string;

  @Property({ type: 'text', nullable: true, fieldName: 'ip_address' })
  ipAddress?: string;

  @Property({ type: 'text', nullable: true, fieldName: 'user_agent' })
  userAgent?: string;

  @Property({ type: 'datetime' })
  expiresAt: Date;

  @Property({ type: 'boolean', default: false, fieldName: 'is_revoked' })
  isRevoked: boolean = false;
}
