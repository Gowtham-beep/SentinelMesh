export const SignUpSchema={
    body:{
        type:'object',
        required:['emial','password'],
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