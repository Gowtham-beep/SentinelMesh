export type Monitor = {
  id: string;
  name: string;
  url: string;
  interval: number; // seconds
  status: 'UP' | 'DOWN' | 'PENDING';
  lastCheckedAt: string | null;
  uptimePercent24h: number;
};

export type MonitorStatus = Monitor['status'];

export type MonitorPayload = {
  name: string;
  url: string;
  interval: number;
  alertEmail: string;
};

export type CheckResult = {
  id: string;
  monitorId: string;
  checkedAt: string;
  statusCode: number | null;
  latencyMs: number | null;
  result: 'UP' | 'DOWN';
};

export type MonitorStats = {
  uptime24h: number;
  uptime7d: number;
  uptime30d: number;
  avgLatency: number;
};

export type Incident = {
  id: string;
  monitorId: string;
  monitorName: string;
  startedAt: string;
  resolvedAt: string | null;
  alertSent: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};
