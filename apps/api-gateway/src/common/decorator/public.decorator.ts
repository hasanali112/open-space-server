// Public decorator
import { SetMetadata } from '@nestjs/common';
import { METADATA_KEY_PUBLIC } from '../constants';

export const Public = () => SetMetadata(METADATA_KEY_PUBLIC, true);
