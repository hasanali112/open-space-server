import { status } from '@grpc/grpc-js';
import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class GrpcValidationPipe implements PipeTransform {
  private readonly logger = new Logger(GrpcValidationPipe.name);

  async transform(value: any, metadata: ArgumentMetadata) {
    this.logger.log('Validation pipe', metadata);
    this.logger.log('pipe value', value);
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const object = plainToClass(metadata.metatype, value);
    this.logger.log('pipe object', object);
    const errors = await validate(object);
    this.logger.log('pipe errors', errors);

    if (errors.length > 0) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Validation failed',
        details: errors,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
