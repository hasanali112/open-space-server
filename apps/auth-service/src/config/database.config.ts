import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { registerAs } from '@nestjs/config';

export const databaseConfig = {
  driver: PostgreSqlDriver,
  host: process.env.POSTGRE_HOST || 'localhost',
  port: process.env.POSTGRE_PORT ? Number(process.env.POSTGRE_PORT) : 5432,
  user: process.env.POSTGRE_USERNAME || 'postgres',
  password: process.env.POSTGRE_PASSWORD || '',
  dbName: process.env.POSTGRE_DB_NAME || 'auth_user_db',
  schema: process.env.POSTGRE_SCHEMA || 'public',
  debug: process.env.NODE_ENV !== 'production',
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  cache: {
    enabled: false,
  },
  preferReadReplicas: true,
  replicas: [
    {
      host: process.env.POSTGRE_REPLICA_HOST || 'localhost',
      port: process.env.POSTGRE_REPLICA_PORT ? Number(process.env.POSTGRE_REPLICA_PORT) : 5433,
      user: process.env.POSTGRE_USERNAME || 'open_space',
      password: process.env.POSTGRE_PASSWORD || 'open_space',
      dbName: process.env.POSTGRE_DB_NAME || 'open_space',
    },
  ],
};

export const dbConfiguration = registerAs('database', () => databaseConfig);
