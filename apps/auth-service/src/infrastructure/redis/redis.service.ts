import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Cluster } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | Cluster;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const isCluster = this.configService.get<boolean>('redis.isCluster', false);
    const nodes = this.configService.get<{ host: string; port: number }[]>('redis.nodes', []);
    const password = this.configService.get<string>('redis.password', '');

    if (!nodes || nodes.length === 0) {
      this.logger.error('Redis nodes are not configured. Check your env variables.');
      return;
    }

    if (isCluster) {
      this.logger.log('Initializing Redis Cluster connection...');
      this.client = new Redis.Cluster(nodes, {
        redisOptions: {
          password: password,
        },
        dnsLookup: (address, callback) => callback(null, address),
      });
    } else {
      this.logger.log('Initializing Single Redis connection...');
      this.client = new Redis({
        host: nodes[0].host,
        port: nodes[0].port,
        password: password,
      });
    }

    this.client.on('connect', () => this.logger.log('Redis connected successfully'));
    this.client.on('error', (err) => this.logger.error('Redis connection error', err));
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  onModuleDestroy() {
    this.client.quit();
  }
}
