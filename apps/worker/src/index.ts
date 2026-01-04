import '@but/config';
import {Worker} from "bullmq";
import {redis} from 'queue';

console.log('Worker started');

new Worker(
    'monitor-check-queue',
    async(job)=>{
        console.log("job received:",job.data);
    },
    {connection:redis}
);  