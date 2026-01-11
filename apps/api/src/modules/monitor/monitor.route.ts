import { FastifyInstance } from "fastify";
import {
    createMonitorSchema,
    getAllMonitorSchema,
    getMonitorByIdSchema,
    deleteMonitorSchema,
    updateMonitorSchema
} from "./monitor.schema.js";

import {
    createMonitor,
    getAllMonitors,
    getMonitorById,
    updateMonitor,
    deleteMonitor,
} from "./monitor.service.js";
import { Monitor } from "../../types/monitor.js";

export async function monitorRoutes(app: FastifyInstance) {
    // POST /monitors
    app.post<{
        Body: {
            name: string,
            url: string,
            method?: string,
            intervalSeconds: number,
        };
        Reply: { monitor: Monitor };
    }>(
        '/',
        { schema: createMonitorSchema },
        async (request, reply) => {
            const { name, url, method, intervalSeconds } = request.body;
            const userId = request.user.sub
            const monitor = await createMonitor(app, userId, { name, url, method, intervalSeconds });

            return reply.code(201).send({ monitor })
        }
    )

    // GET /monitors
    app.get<{
        Reply: Monitor[] // Simplified response
    }>(
        '/',
        { schema: getAllMonitorSchema },
        async (request, reply) => {
            const userId = request.user.sub;
            const monitors = await getAllMonitors(app, userId);
            // Assuming frontend handles array directly now based on my plan
            return reply.code(200).send(monitors);
        }
    )

    // GET /monitors/:id
    app.get<{
        Params: { id: string };
        Reply: Monitor // Simplified response
    }>(
        '/:id',
        { schema: getMonitorByIdSchema },
        async (request, reply) => {
            const { id } = request.params;
            const userId = request.user.sub;
            const monitor = await getMonitorById(app, id, userId);
            return reply.code(200).send(monitor);
        }
    )

    // PATCH /monitors/:id
    app.patch<{
        Params: { id: string };
        Body: {
            name?: string,
            url?: string,
            method?: string,
            intervalSeconds?: number,
            isActive?: boolean
        };
        Reply: Monitor // Simplified response
    }>(
        '/:id',
        { schema: updateMonitorSchema }, // Need to ensure schema supports partials
        async (request, reply) => {
            const { id } = request.params;
            const data = request.body;
            const userId = request.user.sub;
            const monitor = await updateMonitor(app, id, userId, data);
            return reply.code(200).send(monitor)
        }
    )

    // DELETE /monitors/:id
    app.delete<{
        Params: { id: string };
    }>(
        '/:id',
        { schema: deleteMonitorSchema },
        async (request, reply) => {
            const { id } = request.params;
            await deleteMonitor(app, id);
            return reply.code(204).send()
        }
    )

    // GET /monitors/:id/checks (Placeholder - needs service impl)
    app.get<{
        Params: { id: string };
        Reply: any[]
    }>(
        '/:id/checks',
        async (request, reply) => {
            // For now return empty array or implement checking service
            // I'll leave this empty or minimal until I implement the service method
            return reply.code(200).send([]);
        }
    )
}
