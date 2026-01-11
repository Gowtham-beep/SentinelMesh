import prisma from 'db';
import { sendEmail } from './email';

export async function processAlert(alertId: string) {
  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
    include: {
      incident: {
        include: { monitor: true }
      }
    }
  });

  if (!alert || alert.status === 'SENT') return;

  const { incident } = alert;
  const subject =
    alert.type === 'INCIDENT_OPENED'
      ? `🚨 Incident OPENED`
      : `✅ Incident RESOLVED`;

  const html = `
    <h3>${subject}</h3>
    <p>Monitor: ${incident.monitor.url}</p>
    <p>Scope: ${incident.scope}</p>
    ${incident.region ? `<p>Region: ${incident.region}</p>` : ''}
    <p>Time: ${new Date().toISOString()}</p>
  `;

  try {
    const monitor = await prisma.monitor.findUnique({
        where:{id:incident.monitorId},
        include:{user:true}
    });
    if (monitor?.user?.email) {
      await sendEmail(monitor.user.email, subject, html);
    }

    await prisma.alert.update({
      where: { id: alert.id },
      data: {
        status: 'SENT',
        sentAt: new Date()
      }
    });
  } catch (err) {
    await prisma.alert.update({
      where: { id: alert.id },
      data: { status: 'FAILED' }
    });
    throw err; 
  }
}
