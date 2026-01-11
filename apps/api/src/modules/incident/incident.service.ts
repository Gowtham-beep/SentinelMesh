import { FastifyInstance } from "fastify";

// Define Incident Mock Type (since DB schema might not exist yet/I am not checking db schema for now)
// I'll assume a basic structure.
interface IncidentMock {
    id: string;
    monitorId: string;
    status: 'OPEN' | 'RESOLVED';
    scope: 'GLOBAL' | 'REGION';
    createdAt: Date;
    resolvedAt?: Date;
}

const MOCK_INCIDENTS: IncidentMock[] = [
    {
        id: 'inc-1',
        monitorId: 'monitor-1',
        status: 'OPEN',
        scope: 'GLOBAL',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    },
    {
        id: 'inc-2',
        monitorId: 'monitor-2',
        status: 'RESOLVED',
        scope: 'REGION',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
    }
];

export async function getIncidents(app: FastifyInstance, filters: { status?: string, scope?: string }) {
    // In a real app, query Prisma
    // return app.prisma.incident.findMany(...)

    let results = MOCK_INCIDENTS;

    if (filters.status && filters.status !== 'all') {
        results = results.filter(i => i.status === filters.status);
    }

    if (filters.scope && filters.scope !== 'all') {
        results = results.filter(i => i.scope === filters.scope);
    }

    return results;
}
