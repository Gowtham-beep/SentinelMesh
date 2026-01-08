import {Redis} from 'ioredis';

// Redis connection for queues (non-blocking operations)
export const redis = new Redis(process.env.REDIS_URL!,{
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    lazyConnect: true,
    connectTimeout: 60000,
    commandTimeout: 5000,
    keepAlive: 30000
})

// Redis connection for workers (blocking operations - must have maxRetriesPerRequest: null)
export const redisWorker = new Redis(process.env.REDIS_URL!,{
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
    connectTimeout: 60000,
    commandTimeout: 30000, // Increased timeout for blocking operations
    keepAlive: 30000
})
