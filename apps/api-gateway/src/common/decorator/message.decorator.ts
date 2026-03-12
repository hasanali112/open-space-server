import { SetMetadata } from '@nestjs/common';
import { METADATA_KEY_MESSAGE } from '../constants';

export const Message = (msg: string) => SetMetadata(METADATA_KEY_MESSAGE, msg);
