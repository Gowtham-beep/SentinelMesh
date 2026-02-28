import prisma from "db";
import { getRecentResults } from "./result";
import { emitAlert } from "./emitAlert";

// Require 2 consecutive DOWN checks per region to create an incident (lower = faster detection)
const CONSECUTIVE_DOWN_THRESHOLD = 2;

export async function verifyRegion(
    monitorId: string,
    region: string
) {
    const result = await getRecentResults(monitorId, region, CONSECUTIVE_DOWN_THRESHOLD);
    if (result.length < CONSECUTIVE_DOWN_THRESHOLD) return;

    const allDown = result.every(res => res.status === 'DOWN');

    const openIncident = await prisma.incident.findFirst({
        where: {
            monitorId,
            scope: 'REGION',
            region,
            status: 'OPEN'
        }
    });

    if (allDown && !openIncident) {
        const newIncident = await prisma.incident.create({
            data: {
                monitorId,
                scope: 'REGION',
                region,
                status: 'OPEN'
            }
        });
        await emitAlert({
            incidentId: newIncident.id,
            type: 'INCIDENT_OPENED',
            channel: 'EMAIL'
        });
    }

    if (!allDown && openIncident) {
        await prisma.incident.update({
            where: { id: openIncident.id },
            data: {
                status: 'RESOLVED',
                closedAt: new Date()
            }
        });
        await emitAlert({
            incidentId: openIncident.id,
            type: 'INCIDENT_RESOLVED',
            channel: 'EMAIL'
        });
    }
}