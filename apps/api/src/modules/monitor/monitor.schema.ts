const createMonitorSchema = {
  body: {
    type: 'object',
    required: ['name', 'url'],
    properties: {
      name: { type: 'string', minLength: 1 },
      url: { type: 'string', format: 'uri' },
      userid:{type:'string',format:'uuid'},
      intervalSeconds: {
        type: 'integer',
        minimum: 1,
        default: 60,
      },
      isActive: {
        type: 'boolean',
        default: true,
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'HEAD'],
        default: 'GET',
      },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        intervalSeconds: {
        type: 'integer',
        minimum: 1,
        default: 60,
      },
      lastChecketAt: {
        type: 'string',
        format: 'date-time',
      },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  },
};


const updateMonitorSchema = {
  body: {
    type: 'object',
    required: ['name', 'url', 'method', 'isActive'],
    properties: {
      name: { type: 'string' },
      url: { type: 'string', format: 'uri' },
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'HEAD'],
      },
      intervalSeconds: {
        type: 'integer',
        minimum: 1,
        default: 60,
      },
      lastChecketAt: {
        type: 'string',
        format: 'date-time',
      },
      isActive: { type: 'boolean' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        intervalSeconds: {
        type: 'integer',
        minimum: 1,
        default: 60,
      },
      lastChecketAt: {
        type: 'string',
        format: 'date-time',
      },
        isActive: { type: 'boolean' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  },
};

const getAllMonitorSchema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          url: { type: 'string' },
          method: { type: 'string' },
          intervalSeconds: {
        type: 'integer',
        minimum: 1,
        default: 60,
      },
      lastChecketAt: {
        type: 'string',
        format: 'date-time',
      },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};


const getMonitorByIdSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        intervalSeconds: {
        type: 'integer',
        minimum: 1,
        default: 60,
      },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  },
};

const deleteMonitorSchema = {
    params: {
    type: 'object',
    required:['id'],
    properties:{
        id:{type:'string',format:'uuid'}
    },
},
    response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};


export{
    createMonitorSchema,
    updateMonitorSchema,
    getAllMonitorSchema,
    getMonitorByIdSchema,
    deleteMonitorSchema
}