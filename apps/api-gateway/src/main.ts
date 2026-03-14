import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 5000;
  const prefix = configService.get<string>('app.globalPrefix') || 'api';

  app.setGlobalPrefix(prefix);

  // Swagger Configuration
  const options = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway Documentation for OpenSpace')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/${prefix}`);
  console.log(`Swagger Docs available at: http://localhost:${port}/${prefix}/docs`);
}
bootstrap();
