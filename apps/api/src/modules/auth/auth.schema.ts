const SignUpSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 }
        },
    },
    response: {
        201: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    }
                },
                accessToken: { type: 'string' },
            },
        },
    },
};

const loginSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 }
        },
    },
    response: {
        201: {
            type: 'object',
            properties: {
                accessToken: { type: 'string' },
            },
        },
    },
};

const authMeSchema = {
    response: {
        200: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    }
                },
                stats: {
                    type: 'object',
                    properties: {
                        totalMonitors: { type: 'number' },
                        upMonitors: { type: 'number' },
                        downMonitors: { type: 'number' }
                    }
                }
            }
        }
    }
};

const updatePasswordSchema = {
    body: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
            currentPassword: { type: 'string' },
            newPassword: { type: 'string', minLength: 8 }
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

export {
    SignUpSchema,
    loginSchema,
    authMeSchema,
    updatePasswordSchema
};
