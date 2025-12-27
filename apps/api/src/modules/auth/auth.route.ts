import { FastifyInstance } from "fastify";
import { SignUpSchema } from "./auth.schema";
import { signUpUser } from "./auth.service";

export async function authroute(app:FastifyInstance) {
    app.post(
        '/signup',
        {schema:SignUpSchema},
        async(request,reply)=>{
            const{email,password}= request.body as {
                email:string,
                password:string
            };
            const user = await signUpUser(app,email,password);

            const accessToken = app.jwt.sign({
                sub:user.id,
                email:user.email
            });
            return reply.code(201).send({accessToken})
        }
    );
    
}