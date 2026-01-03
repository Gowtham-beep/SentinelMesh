import {Queue} from 'bullmq';
import {redis} from './redis';
import '@but/config'
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