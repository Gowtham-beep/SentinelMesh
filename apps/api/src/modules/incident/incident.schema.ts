const incidentItemSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        monitorId: { type: 'string' },
        status: { type: 'string' },
        scope: { type: 'string' },
        region: { type: ['string', 'null'] },
        openedAt: { type: 'string', format: 'date-time' },
        closedAt: { type: ['string', 'null'], format: 'date-time' },
        monitor: {
            type: 'object',
            nullable: true,
            properties: {
                name: { type: 'string' },
                url: { type: 'string' },
            },
        },
    },
};

export const getIncidentsSchema = {
    querystring: {
        type: 'object',
        properties: {
            status: { type: 'string' },
            scope: { type: 'string' },
        },
    },
    response: {
        200: { type: 'array', items: incidentItemSchema },
    },
};

export const deleteIncidentSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
    },
    // No response schema — 204 No Content has an empty body
};

export const resolveIncidentSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
    },
    response: { 200: incidentItemSchema },
};
