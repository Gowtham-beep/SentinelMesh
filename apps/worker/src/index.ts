import '@but/config';
import {Worker} from "bullmq";
import {redisWorker} from 'queue';
import prisma from 'db';

console.log('Worker started');

import { httpCheck } from './checks/http';
import { pingCheck } from './checks/ping';

new Worker(
    'monitor-check-queue',
    async(job)=>{
        const {
            monitorId,
            url,
            method,
            region,
            scheduledAt,
        }=job.data;
        let result;
        if(method ==='GET' || method === 'POST' || method === 'PUT' || method === 'HEAD'){
            result = await httpCheck(url);
        }else{
            result = await pingCheck(url);
        }

        await prisma.checkResult.create({
            data:{
                monitorId,
                region,
                status:result.status,
                statusCode: 'statuscode' in result ? result.statuscode : null,
                latencyms: 'latencyMs' in result ? result.latencyMs : null,
                error: result.error || null,
                scheduledAt: new Date(scheduledAt)
            }
        });
        return {ok:true};
    },{
        connection:redisWorker,
        concurrency:5
    }
)
