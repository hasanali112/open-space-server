// Transform interceptor
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { METADATA_KEY_MESSAGE } from '../constants';

export interface Response<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformaInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const res = ctx.switchToHttp().getResponse();
    const statusCode = res.statusCode;

    const message = this.reflector.getAllAndOverride<string>(
      METADATA_KEY_MESSAGE,
      [ctx.getHandler(), ctx.getClass()],
    );

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        success: true,
        message,
        data,
      })),
    );
  }
}
