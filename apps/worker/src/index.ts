import '@but/config';
import {Worker} from "bullmq";
import {redisWorker} from 'queue';

console.log('Worker started');

new Worker(
    'monitor-check-queue',
    async(job)=>{
        console.log("job received:",job.data);

        // TODO: Implement actual monitor checking logic here
        // For now, just mark the job as completed
        return job.data;
    },
    {connection:redisWorker}
);
