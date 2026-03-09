import { Redis } from 'ioredis';

const tlsConfig = process.env.REDIS_URL?.startsWith('rediss://')
  ? { tls: { rejectUnauthorized: false } }
  : {};

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  lazyConnect: true,
  connectTimeout: 60000,
  commandTimeout: 10000,
  keepAlive: 30000,
  ...tlsConfig
});

export const redisWorker = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  connectTimeout: 60000,
  commandTimeout: 60000,
  keepAlive: 30000,
  ...tlsConfig
});
