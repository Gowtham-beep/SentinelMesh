export type MonitorCheckJob = {
    monitorId: string;
    url: string;
    method: string;
    region: 'IN' | 'EU' | 'US';
    scheduledAt: string;
};