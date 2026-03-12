import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AuthService {
  healthCheck(data: any): Observable<any>;
}

@Controller('auth')
export class AuthServiceController implements OnModuleInit {
  private authService: AuthService;

  constructor(@Inject('AUTH_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Get('health')
  healthCheck() {
    return this.authService.healthCheck({});
  }
}
