import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 5000;
  const prefix = configService.get<string>('app.globalPrefix') || 'api';

  app.setGlobalPrefix(prefix);
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/${prefix}`);
}
bootstrap();
