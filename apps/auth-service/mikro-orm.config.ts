import 'dotenv/config';
import * as path from 'path';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { databaseConfig } from './src/config/database.config';
import { Migrator } from '@mikro-orm/migrations';

// ─── CLI Config (used by MikroORM CLI for migrations) ────────────────────────
const cliConfig = {
  ...databaseConfig,
  migrations: {
    path: path.join(__dirname, 'src/database/migrations'),
  },
  extensions: [Migrator],
};

// ─── App Config (used by NestJS MikroOrmModule) ───────────────────────────────
const ormConfig: MikroOrmModuleOptions = {
  ...databaseConfig,
  ...cliConfig,
};

export default ormConfig;
