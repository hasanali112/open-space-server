import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {}
