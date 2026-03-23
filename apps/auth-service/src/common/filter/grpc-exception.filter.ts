import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  /**
   * Catches all exceptions and converts them to gRPC errors.
   * Only handles gRPC context — HTTP requests pass through to default exception handling.
   * gRPC expects a specific object structure (code and message) instead of standard NestJS exceptions.
   */
  catch(exception: unknown, host: ArgumentsHost): Observable<never> {
    // Only handle gRPC context — let HTTP use default exception handling
    if (host.getType() !== 'rpc') {
      throw exception;
    }

    let code: number = status.INTERNAL;
    let message: string = 'Internal server error';

    if (exception instanceof RpcException) {
      const error = exception.getError();
      if (typeof error === 'object' && error !== null) {
        code = (error as Record<string, unknown>).code as number ?? status.INTERNAL;
        const msg = (error as Record<string, unknown>).message;
        message = typeof msg === 'string'
          ? msg
          : msg != null
            ? JSON.stringify(msg)
            : JSON.stringify(error);
      } else {
        message = String(error);
      }
    } else if (exception instanceof HttpException) {
      code = this.mapHttpStatusToGrpcStatus(exception.getStatus());
      message = this.extractMessageFromHttpException(exception);
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      message = typeof exception === 'string' ? exception : JSON.stringify(exception);
    }

    this.logger.error(`gRPC Error: code=${code}, message=${message}`);

    return throwError(() => ({
      code,
      message,
    }));
  }

  /**
   * Extracts a readable message from HttpException (handles validation arrays).
   */
  private extractMessageFromHttpException(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }
    if (typeof response === 'object' && response !== null) {
      const msg = (response as Record<string, unknown>).message;
      if (Array.isArray(msg)) {
        return msg.map((m) => String(m)).join('; ');
      }
      if (typeof msg === 'string') {
        return msg;
      }
    }
    return exception.message;
  }

  /**
   * Maps HTTP status codes to gRPC status codes.
   */
  private mapHttpStatusToGrpcStatus(httpStatus: number): number {
    switch (httpStatus) {
      case 400:
        return status.INVALID_ARGUMENT;
      case 401:
        return status.UNAUTHENTICATED;
      case 403:
        return status.PERMISSION_DENIED;
      case 404:
        return status.NOT_FOUND;
      case 408:
        return status.DEADLINE_EXCEEDED;
      case 409:
        return status.ALREADY_EXISTS;
      case 412:
        return status.FAILED_PRECONDITION;
      case 413:
        return status.RESOURCE_EXHAUSTED;
      case 422:
        return status.INVALID_ARGUMENT;
      case 429:
        return status.RESOURCE_EXHAUSTED;
      case 500:
        return status.INTERNAL;
      case 501:
        return status.UNIMPLEMENTED;
      case 502:
      case 504:
        return status.UNAVAILABLE;
      case 503:
        return status.UNAVAILABLE;
      default:
        return status.INTERNAL;
    }
  }
}
