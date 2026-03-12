import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthServiceController } from './auth-service.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(
            __dirname,
            '../../../../../libs/contracts/src/proto/auth.proto',
          ),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [AuthServiceController],
})
export class AuthServiceModule {}
