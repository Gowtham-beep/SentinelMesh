import { FastifyInstance } from "fastify";
import { hashPassword } from "../../utils/password";

export async function signUpUser(
    app:FastifyInstance,
    email:string,
    password:string
){
    const exsiting = await app.prisma.user.findUnique({
        where:{
            email:email,
        },
    });
    if(exsiting){
        throw new Error('User Already Exsits')
    }
    const hashedPassword =  await hashPassword(password)
    const user = await app.prisma.user.create({
        data:{
            email,
            password:hashedPassword
        },
    });
    return user;
}