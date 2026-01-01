import fp from 'fastify-plugin'
import '@fastify/jwt';
import { JwtPayload } from '../types/jwt';



export default fp(async(app)=>{
    if(!app.hasRequestDecorator('user')){
        app.decorateRequest('user', null as unknown as JwtPayload);
    }
    app.addHook('preHandler',async(request,reply)=>{
        try{
            const payload = await request.jwtVerify<JwtPayload>();
        request.user = payload;
        }catch{
            reply.code(401).send({message:'Unauthorized'});
        }
    })
})