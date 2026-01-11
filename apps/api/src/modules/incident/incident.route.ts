import { FastifyInstance } from "fastify";
import { getIncidents } from "./incident.service.js";
import { getIncidentsSchema } from "./incident.schema.js";

export async function incidentRoutes(app: FastifyInstance) {
    app.get<{
        Querystring: { status?: string; scope?: string };
    }>(
        '/',
        { schema: getIncidentsSchema },
        async (request, reply) => {
            const { status, scope } = request.query;
            const incidents = await getIncidents(app, { status, scope });
            return reply.code(200).send(incidents);
        }
    );
}
