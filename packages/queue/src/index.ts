import {Queue} from 'bullmq';
import {redis, redisWorker} from './redis';
import '@but/config'

export {redis, redisWorker};

export const  monitorCheckQueue = new Queue(
    'monitor-check-queue',
    {
        connection:redis,
        defaultJobOptions:{
            attempts:3,
            backoff:{
                type:'exponential',
                delay:5000
            },
            removeOnComplete:true,
            removeOnFail:true
        }
    }
);
