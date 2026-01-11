import prisma from "db";
import { emitAlert } from "./emitAlert";

export async function verifyGlobal(monitorId:string){
    const openRegional = await prisma.incident.findMany({
        where:{
            monitorId,
            scope:"REGION",
            status:"OPEN"
        }
    });
    const openGlobal = await prisma.incident.findFirst({
        where:{
            monitorId,
            scope:"GLOBAL",
            status:"OPEN"
        }
    });
    if(openRegional.length>=2 && !openGlobal){
        const newIncident = await prisma.incident.create({
            data:{
                monitorId,
                scope:"GLOBAL",
                status:"OPEN"
            }
        });
        await emitAlert({
                    incidentId:newIncident.id,
                    type:'INCIDENT_OPENED',
                    channel:'EMAIL'
                });   
    }
    if(openRegional.length<2 && openGlobal){
        await prisma.incident.update({
            where:{
                id:openGlobal.id
                },
            data:{
                status:"RESOLVED",
                closedAt:new Date()
            }
        });
        await emitAlert({
                    incidentId:openGlobal.id,
                    type:'INCIDENT_RESOLVED',
                    channel:'EMAIL'
                });
    }
}