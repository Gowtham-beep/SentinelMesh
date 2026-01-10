import prisma from "db";
import { getRecentResults } from "./result";

export async function verifyRegion(
    monitorId:string,
    region:string
){
    const result = await getRecentResults(monitorId,region,3);
    if(result.length<3) return;

    const allDown = result.every(res=>res.status==='DOWN');

    const openIncident = await prisma.incident.findFirst({
        where:{
            monitorId,
            scope:'REGION',
            region,
            status:'OPEN'
        }
    });
    if(allDown && !openIncident){
        await prisma.incident.create({
            data:{
                monitorId,
                scope:'REGION',
                region,
                status:'OPEN'
            }
        });
    }
    if(!allDown && openIncident){
        await prisma.incident.update({
            where:{id:openIncident.id},
            data:{
                status:'RESOLVED',
                closedAt: new Date()
            }
        })
    }
}