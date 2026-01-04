import '@but/config';
import dayjs from 'dayjs';
import {monitorCheckQueue} from "queue"
import prisma from 'db'

const REGION = ['IN','EU','US'] as const;
const TICK_SECONDS = 10;

console.log('Scheduler Started');

setInterval(async()=>{
    const now = dayjs();
    const allMonitors = await prisma.monitor.findMany({
        where:{
            isActive:true
        }
    });
    const dueMonitors = allMonitors.filter(monitor => {
        if (!monitor.lastCheckedAt) return true;
        const intervalMs = (monitor.intervalSeconds || 60) * 1000; // default 60 seconds if null
        return now.diff(dayjs(monitor.lastCheckedAt), 'millisecond') >= intervalMs;
    });
    for(const monitor of dueMonitors){
        const scheduleAt = now.startOf('minute').toISOString();
        for(const region of REGION){
            const jobId=`${monitor.id}:${region}:${scheduleAt}`;

            await monitorCheckQueue.add(
                'check',
                {
                    monitorId:monitor.id,
                    user:monitor.url,
                    type:monitor.method,
                    region,
                    scheduledAt:scheduleAt
                },
                {
                    jobId
                }
            );
        }
        await prisma.monitor.update({
                where:{id:monitor.id},
                data:{lastCheckedAt:now.toDate()}
            });
    }
}, TICK_SECONDS * 1000);
