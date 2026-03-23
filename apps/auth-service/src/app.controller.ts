import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // HTTP GET — testable via Swagger at GET /api/health
  @Get('health')
  @ApiOperation({ summary: 'Health check', description: 'Check if auth-service is running' })
  @ApiResponse({ status: 200, description: 'Service is healthy', schema: { example: { status: 'Service is ok' } } })
  healthCheckHttp() {
    return { status: this.appService.getHello() };
  }

  // gRPC method — called from api-gateway
  @GrpcMethod('AuthService', 'healthCheck')
  healthCheck() {
    return { status: this.appService.getHello() };
  }
}
