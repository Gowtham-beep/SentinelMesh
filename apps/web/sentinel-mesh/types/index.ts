export interface Monitor {
    id: string;
    name: string;
    url: string;
    interval: number; // seconds
    status: 'active' | 'inactive' | 'paused';
    // Assuming 'status' is administrative status (enabled/disabled) 
    // OR health status? 
    // Prompt: "List monitors (name, URL, interval, status)" -> "Clear status colors: Green -> healthy".
    // So likely 'status' refers to HEALTH.
    // But there's also "Enable / disable monitor".
    // Let's assume the object has `isActive` (hook/config) and `currentStatus` (health).
    // If the API matches the prompt "status colors", I'll look for a field that indicates health.
    // For now I'll use `status` as the health field and maybe `enabled` boolean.
    // I'll update this as I see fit or keep it flexible.
    currentStatus?: 'UP' | 'DOWN' | 'DEGRADED';
    enabled: boolean;
    lastCheck?: {
        status: 'UP' | 'DOWN';
        latency: number;
        createdAt: string;
    };
}

export interface Incident {
    id: string;
    monitorId: string;
    status: 'OPEN' | 'RESOLVED';
    createdAt: string;
    resolvedAt?: string;
}
