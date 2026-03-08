import '@but/config';
import { Worker, Job } from "bullmq";
import { redisWorker } from 'queue';
import prisma from 'db';

console.log('Worker started');

import { httpCheck } from './checks/http.js';
import { pingCheck } from './checks/ping.js';
import { processAlert } from './alert/processor.js';

import { MonitorCheckJob, SendAlertJob } from 'queue';

new Worker<MonitorCheckJob>(
    'monitor-check-queue',
    async (job: Job<MonitorCheckJob>) => {
        const {
            monitorId,
            url,
            method,
            region,
            scheduledAt,
        } = job.data;
        let result;
        if (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'HEAD') {
            result = await httpCheck(url);
        } else {
            result = await pingCheck(url);
        }

        await prisma.checkResult.create({
            data: {
                monitorId,
                region,
                status: result.status,
                statusCode: 'statuscode' in result ? result.statuscode : null,
                latencyms: 'latencyMs' in result ? result.latencyMs : null,
                error: result.error || null,
                scheduledAt: new Date(scheduledAt)
            }
        });
    }, {
    connection: redisWorker,
    concurrency: 5
}
)

new Worker<SendAlertJob>(
    'send-alert',
    async (job: Job<SendAlertJob>) => {
        await processAlert(job.data.alertId);
    }, {
    connection: redisWorker,
    concurrency: 3
}
)

// Cloud Run requires a listening port to consider the service healthy
import http from 'http';
http.createServer((_, res) => res.end('ok')).listen(process.env.PORT || 8082);
