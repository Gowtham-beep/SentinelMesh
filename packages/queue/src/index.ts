import { Queue } from 'bullmq';
import { redis, redisWorker } from './redis.js';
import '@but/config'
import { MonitorCheckJob } from './types/monitorCheckjob.js';
import { SendAlertJob } from './types/sendAlertJob.js';

export { redis, redisWorker };
export type { MonitorCheckJob, SendAlertJob };

export const monitorCheckQueue = new Queue<MonitorCheckJob>(
    'monitor-check-queue',
    {
        connection: redis,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: true
        }
    }
);

export const alertQueue = new Queue<SendAlertJob>(
    'send-alert',
    {
        connection: redis,
        defaultJobOptions: {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: true,
            removeOnFail: true
        }
    }
);