import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { Otp } from './otp.entity';

@Injectable()
export class OtpRepository extends BaseRepository<Otp> {}
