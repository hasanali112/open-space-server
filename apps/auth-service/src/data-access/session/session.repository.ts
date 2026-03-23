import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { Session } from './session.entity';

@Injectable()
export class SessionRepository extends BaseRepository<Session> {}
