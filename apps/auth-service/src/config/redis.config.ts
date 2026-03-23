import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  isCluster: true,
  nodes: process.env.REDIS_CLUSTER_NODES 
    ? process.env.REDIS_CLUSTER_NODES.split(',').map(node => {
        const [host, port] = node.split(':');
        return { host, port: parseInt(port, 10) };
      })
    : [{ host: 'localhost', port: 6379 }],
  password: process.env.REDIS_PASSWORD || 'open_space_redis',
  ttl: 3600, // Default TTL in seconds
}));
