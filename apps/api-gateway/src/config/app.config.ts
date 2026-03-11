import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  globalPrefix: process.env.GLOBAL_PREFIX || 'api',
  env: process.env.NODE_ENV || 'development',

  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    },
  },
}));
