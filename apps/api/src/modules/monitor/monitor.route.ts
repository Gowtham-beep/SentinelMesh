import { FastifyInstance } from "fastify";
import {
    createMonitorSchema, getAllMonitorSchema, getMonitorByIdSchema,
    deleteMonitorSchema, updateMonitorSchema,
} from "./monitor.schema.js";
import {
    createMonitor, getAllMonitors, getMonitorById,
    updateMonitor, deleteMonitor, getMonitorChecks, getMonitorStats,
} from "./monitor.service.js";

export async function monitorRoutes(app: FastifyInstance) {

    // POST /monitors
    app.post('/', { schema: createMonitorSchema }, async (request: any, reply) => {
        const { name, url, method, intervalSeconds } = request.body;
        const userId = request.user.sub;
        const monitor = await createMonitor(app, userId, { name, url, method, intervalSeconds });
        return reply.code(201).send({ monitor });
    });

    // GET /monitors
    app.get('/', { schema: getAllMonitorSchema }, async (request: any, reply) => {
        const userId = request.user.sub;
        const monitors = await getAllMonitors(app, userId);
        return reply.code(200).send(monitors);
    });

    // GET /monitors/:id/stats  — must come BEFORE /:id to avoid conflict
    app.get('/:id/stats', async (request: any, reply) => {
        const { id } = request.params;
        const stats = await getMonitorStats(app, id);
        return reply.code(200).send(stats);
    });

    // GET /monitors/:id/checks
    app.get('/:id/checks', async (request: any, reply) => {
        const { id } = request.params;
        const limit = Number((request.query as any).limit) || 100;
        const checks = await getMonitorChecks(app, id, limit);
        return reply.code(200).send(checks);
    });

    // GET /monitors/:id
    app.get('/:id', { schema: getMonitorByIdSchema }, async (request: any, reply) => {
        const { id } = request.params;
        const userId = request.user.sub;
        const monitor = await getMonitorById(app, id, userId);
        return reply.code(200).send(monitor);
    });

    // PATCH /monitors/:id
    app.patch('/:id', { schema: updateMonitorSchema }, async (request: any, reply) => {
        const { id } = request.params;
        const userId = request.user.sub;
        const monitor = await updateMonitor(app, id, userId, request.body);
        return reply.code(200).send(monitor);
    });

    // DELETE /monitors/:id
    app.delete('/:id', { schema: deleteMonitorSchema }, async (request: any, reply) => {
        const { id } = request.params;
        await deleteMonitor(app, id);
        return reply.code(204).send();
    });
}
