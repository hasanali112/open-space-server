import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { AuthServiceModule } from './module/auth-service/auth-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    AuthServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
