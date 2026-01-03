export type MonitorCheckQueue={
    monitorId:string;
    url:string;
    type:'HTTP'|'PING';
    region: 'IN' | 'EU' | 'US';
    scheduledAt:string;
};