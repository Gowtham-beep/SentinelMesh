export const getIncidentsSchema = {
    querystring: {
        type: 'object',
        properties: {
            status: { type: 'string' },
            scope: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    monitorId: { type: 'string' },
                    status: { type: 'string' },
                    scope: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    resolvedAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    },
};
