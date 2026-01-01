import { FastifyInstance } from "fastify";
import { createMonitorSchema } from "./monitor.schema";
import { createMonitor } from "./monitor.service";
import { Monitor } from "../../types/monitor";

export async function monitorRoutes(app:FastifyInstance){
    app.post<{
        Body:{name:string,url:string,method:string};
        Reply:{mesage:string,monitor:Monitor};
    }>(
     '/create',
     {schema:createMonitorSchema},
     async(request,reply)=>{
        const {name,url,method} = request.body;
        const userId = request.user.sub
        const monitor = await createMonitor(app,userId,{name,url,method});
        
        return reply.code(201).send({
            mesage:'Monitor data Added successfully',
            monitor,
        })
     }   
    )
}