import { Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import { classValidatorExceptionFactory } from '../utilities';

/**
 * Custom validation pipe options including protocol support.
 */
interface PayloadValidationPipeOptions extends ValidationPipeOptions {
  protocol?: 'http' | 'websocket';
}

/**
 * Industry-standard advanced Validation Pipe.
 * Automatically transforms payloads, strips non-whitelisted properties,
 * and formats errors using a central factory.
 */
@Injectable() // Importing Injectable if needed, but for global use it is not strictly required if initialized in main.ts
export class PayloadValidationPipe extends ValidationPipe {
  constructor(options?: PayloadValidationPipeOptions) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: classValidatorExceptionFactory,
      ...options,
    } as ValidationPipeOptions);
  }
}
