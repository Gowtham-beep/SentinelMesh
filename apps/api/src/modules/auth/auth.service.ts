import { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";
import { hashPassword, verifyPassword } from "../../utils/password.js";

async function signUpUser(
    app:FastifyInstance,
    email:string,
    password:string
){
   const hashedPassword = await hashPassword(password);
    try {
        const user = await app.prisma.user.create({
            data:{
                email,
                password:hashedPassword,
            },select:{
                id:true,
                email:true,
                createdAt:true,
                updatedAt:true,
            }
        });
        return user;
    } catch (e) {
        if(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'){
            throw new Error('User Already exists')
        }
        throw e;
    }
}


async function logIn(
    app:FastifyInstance,
    email:string,
    password:string
){
    const existing = await app.prisma.user.findUnique({
        where:{
            email:email,
        },
    });
    if(!existing){
        throw new Error('User Does Not Exists')
    }
    const isValid = await verifyPassword(password,existing.password);
    if(!isValid){
        throw new Error('Invalid Password')
    }
    const accessToken = app.jwt.sign({
        sub:existing.id,
        email:existing.email
    });
    return accessToken;
}

export{
    signUpUser,
    logIn
    
}
