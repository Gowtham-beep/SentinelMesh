// ─── Monitor ─────────────────────────────────────────────
export type Monitor = {
  id: string;
  name: string;
  url: string;
  method: string;
  intervalSeconds: number | null;
  lastCheckedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Computed fields (may not always be present):
  status?: 'UP' | 'DOWN' | 'PENDING';
  uptimePercent24h?: number | null;
};

// ─── CheckResult ─────────────────────────────────────────
export type CheckResult = {
  id: string;
  monitorId: string;
  region: string;
  status: string;        // e.g. "UP", "DOWN", "ERROR"
  statusCode: number | null;
  latencyms: number | null; // lowercase m — matches Prisma schema
  error: string | null;
  scheduledAt: string;
  checkedAt: string;
};

// ─── MonitorStats ────────────────────────────────────────
export type MonitorStats = {
  uptime24h: number;
  uptime7d: number;
  uptime30d: number;
  avgLatency: number;
};

// ─── Incident ────────────────────────────────────────────
export type Incident = {
  id: string;
  monitorId: string;
  scope: 'GLOBAL' | 'REGION';
  region: string | null;
  status: 'OPEN' | 'RESOLVED';
  openedAt: string;
  closedAt: string | null;
  monitor?: {
    name: string;
    url: string;
  };
};

// ─── Auth ────────────────────────────────────────────────
export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

// ─── Monitor payload ─────────────────────────────────────
export type MonitorPayload = {
  name: string;
  url: string;
  intervalSeconds: number;
  alertEmail: string;
};

// ─── Aliases for convenience ─────────────────────────────
export type MonitorStatus = NonNullable<Monitor['status']>;
