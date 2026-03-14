import { ValidationError, BadRequestException } from '@nestjs/common';

/**
 * Factory to format class-validator errors into a clean, readable format.
 */
export const classValidatorExceptionFactory = (errors: ValidationError[]) => {
  const formattedErrors = errors.map((error) => {
    // If there are nested children, recursively handle them or just take the first level
    // For simplicity in industry apps, often the first constraint is enough
    const constraints = error.constraints;
    const message = constraints
      ? Object.values(constraints)[0]
      : 'Invalid value';

    return {
      field: error.property,
      message: message,
    };
  });

  return new BadRequestException({
    message: 'Validation failed',
    errors: formattedErrors,
  });
};
