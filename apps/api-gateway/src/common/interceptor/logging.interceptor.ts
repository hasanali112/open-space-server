// Logging interceptor

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const { method, url } = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(`Completed: ${method} ${url} - ${duration}ms`);
      }),
    );
  }
}
