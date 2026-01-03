import { FastifyInstance } from "fastify";
import { createMonitorSchema,
        getAllMonitorSchema,
        getMonitorByIdSchema
 } from "./monitor.schema.js";

import { createMonitor,
        getAllMonitors,
        getMonitorById,
        updateMonitor,
        deleteMonitor,
 } from "./monitor.service.js";
import { Monitor } from "../../types/monitor.js";

export async function monitorRoutes(app:FastifyInstance){
    app.post<{
        Body:{
            name:string,
            url:string,
            method:string,
            intervalSeconds:number,
        };
        Reply:{mesage:string,monitor:Monitor};
    }>(
     '/create',
     {schema:createMonitorSchema},
     async(request,reply)=>{
        const {name,url,method,intervalSeconds} = request.body;
        const userId = request.user.sub
        const monitor = await createMonitor(app,userId,{name,url,method,intervalSeconds});
        
        return reply.code(201).send({
            mesage:'Monitor data Added successfully',
            monitor,
        })
     }   
    )
    app.get<{
        Reply:{monitors:Monitor[]}
    }>(
        '/getAll',
        {schema:getAllMonitorSchema},
        async(request,reply)=>{
            const userId = request.user.sub;
            const monitors = await getAllMonitors(app,userId);
            return reply.code(200).send({ monitors });
        }
    )
    app.get<{
        Params:{id:string};
        Reply:{monitor:Monitor}
    }>(
        '/get/:id',
        {schema:getMonitorByIdSchema},
        async(request,reply)=>{
            const {id} = request.params;
            const userId = request.user.sub;
            const monitor = await getMonitorById(app,id,userId);
            return reply.code(200).send({ monitor });

        }
    )
    app.put<{
        Params:{id:string};
        Body:{
            name:string,
            url:string,
            method:string,
            intervalSeconds:number,
            isActive:boolean
        };
        Reply:{message:string,monitor:Monitor}
    }>(
        '/update/:id',
        async(request,reply)=>{
            const {id} = request.params;
            const {name,url,method,intervalSeconds,isActive} = request.body;
            const userId = request.user.sub;
            const monitor = await updateMonitor(app,id,userId,{name,url,method,intervalSeconds,isActive});
            return reply.code(200).send({
                message:'Monitor data updated successfully',
                monitor
            })
        }
    )
    app.delete<{
        Params:{id:string};
        Reply:{message:string}
    }>(
        '/delete/:id',
        async(request,reply)=>{
            const {id} = request.params;
            await deleteMonitor(app,id);
            return reply.code(200).send({
                message:'Monitor data deleted successfully'
            })
        }
    )
}
