import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GrpcExceptionFilter } from './common/filter/grpc-exception.filter';
import { GrpcValidationPipe } from './common/interceptor/grpc-validation.pipe';
import { dbConfiguration } from './config/database.config';
import { BaseRepository } from './data-access/base.repository';
import { User } from './data-access/user/user.entity';
import { Session } from './data-access/session/session.entity';
import { Otp } from './data-access/otp/otp.entity';
import { redisConfig } from './config/redis.config';
import { RedisModule } from './infrastructure/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration, redisConfig],
    }),
    RedisModule,
    MikroOrmModule.forRootAsync({
      useFactory: (dbConfig: ConfigType<typeof dbConfiguration>) => {
        return {
          ...dbConfig,
          entityRepository: BaseRepository,
        };
      },
      inject: [dbConfiguration.KEY],
    }),
    MikroOrmModule.forFeature([User, Session, Otp]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: GrpcValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GrpcExceptionFilter,
    },
  ],
})
export class AppModule {}
