import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GrpcExceptionFilter } from './common/filter/grpc-exception.filter';

async function bootstrap() {
  // Hybrid app: HTTP (REST) + gRPC both run together
  const app = await NestFactory.create(AppModule);

  // Global prefix
  const prefix = 'api';
  app.setGlobalPrefix(prefix);

  // Swagger Configuration
  const options = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Auth Service REST API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  // Attach gRPC as a connected microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(
        __dirname,
        '../../../libs/contracts/src/proto/auth.proto',
      ),
      url: '0.0.0.0:50051',
    },
  });

  // Start gRPC microservice
  await app.startAllMicroservices();

  // Start HTTP server for direct REST testing
  const port = 3001;
  await app.listen(port);

  console.log(
    `[Auth Service] REST API running on: http://localhost:${port}/${prefix}`,
  );
  console.log(
    `[Auth Service] Swagger Docs: http://localhost:${port}/${prefix}/docs`,
  );
  console.log(`[Auth Service] gRPC listening on: 0.0.0.0:50051`);
}
bootstrap();
