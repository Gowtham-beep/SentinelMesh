import { FastifyInstance } from "fastify";
import { IncidentScope, IncidentStatus } from "@prisma/client";

export async function getIncidents(
    app: FastifyInstance,
    filters: { status?: string; scope?: string }
) {
    const where: any = {};

    if (filters.status && filters.status !== 'all') {
        where.status = filters.status as IncidentStatus;
    }

    if (filters.scope && filters.scope !== 'all') {
        where.scope = filters.scope as IncidentScope;
    }

    return app.prisma.incident.findMany({
        where,
        orderBy: {
            openedAt: 'desc',
        },
        include: {
            monitor: {
                select: {
                    name: true,
                    url: true,
                },
            },
        },
    });
}
