const SignUpSchema={
    body:{
        type:'object',
        required:['email','password'],
        properties:{
            email:{type:'string',format:'email'},
            password:{type:'string',minLength:8}
        },
    },
    response:{
        201:{
            type:'object',
            properties:{
                user:{type:'object',
                    properties:{
                        id:{type:'string'},
                        email:{type:'string'},
                        createdAt:{type:'string'},
                        updatedAt:{type:'string'},
                    }
                },
                accessToken:{type:'string'},
            },
        },
    },
};

const loginSchema={
    body:{
        type:'object',
        required:['email','password'],
        properties:{
            email:{type:'string',format:'email'},
            password:{type:'string',minLength:8}
        },
    },
    response:{
        201:{
            type:'object',
            properties:{
                accessToken:{type:'string'},
            },
        },
    },
};

export {
    SignUpSchema,
    loginSchema
};
