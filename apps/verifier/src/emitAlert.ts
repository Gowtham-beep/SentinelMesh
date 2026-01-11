import prisma from "db";
import { alertQueue } from "queue";

type EmitArgs = {
    incidentId:string;
    type:'INCIDENT_OPENED'|'INCIDENT_RESOLVED';
    channel:'EMAIL';
}

export async function emitAlert({
    incidentId,
    type,
    channel = 'EMAIL'
}:EmitArgs){
    const alert = await prisma.alert.upsert({
        where:{
            incidentId_type_channel:{
                incidentId,
                type,
                channel
            }
        },
        update:{},
        create:{
            incidentId,
            type,
            channel,
            status:'PENDING'
        }
    });

    const jobId = `${incidentId}:${type}:{channel}`;

    await alertQueue.add(
        'send-alert',
        {alertId:alert.id},
        {jobId}
    );
}