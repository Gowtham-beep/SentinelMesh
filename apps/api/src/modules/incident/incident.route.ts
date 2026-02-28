import { FastifyInstance } from "fastify";
import { getIncidents, deleteIncident, resolveIncident } from "./incident.service.js";
import { getIncidentsSchema, deleteIncidentSchema, resolveIncidentSchema } from "./incident.schema.js";

export async function incidentRoutes(app: FastifyInstance) {

    // GET /incidents
    app.get<{
        Querystring: { status?: string; scope?: string };
    }>(
        '/',
        { schema: getIncidentsSchema },
        async (request, reply) => {
            const { status, scope } = request.query;
            const userId = (request as any).user.sub;
            const incidents = await getIncidents(app, { status, scope, userId });
            return reply.code(200).send(incidents);
        }
    );

    // DELETE /incidents/:id
    app.delete<{
        Params: { id: string };
    }>(
        '/:id',
        { schema: deleteIncidentSchema },
        async (request, reply) => {
            const { id } = request.params;
            await deleteIncident(app, id);
            return reply.code(204).send();
        }
    );

    // PATCH /incidents/:id/resolve
    app.patch<{
        Params: { id: string };
    }>(
        '/:id/resolve',
        { schema: resolveIncidentSchema },
        async (request, reply) => {
            const incident = await resolveIncident(app, request.params.id);
            return reply.code(200).send(incident);
        }
    );
}
