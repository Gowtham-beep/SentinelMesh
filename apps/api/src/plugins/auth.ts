import fp from 'fastify-plugin'
import '@fastify/jwt';
import { user } from '../types/user';

 

export default fp(async(app)=>{
    app.decorateRequest('user', null as unknown as user);
    app.addHook('preHandler',async(request,reply)=>{
        try{
            const payload = await request.jwtVerify();
        request.user = payload;
        }catch{
            reply.code(401).send({message:'Unauthorized'});
        }
    })
})