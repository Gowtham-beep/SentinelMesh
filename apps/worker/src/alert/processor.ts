import prisma from 'db';
import { sendEmail } from './email';

export async function processAlert(alertId: string) {
  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
    include: {
      incident: {
        include: {
          monitor: {
            include: {
              alerts: true,   // AlertConfig (1-1 relation named 'alerts')
              user: true,
            }
          }
        }
      }
    }
  });

  if (!alert || alert.status === 'SENT') return;

  const { incident } = alert;
  const { monitor } = incident;

  // Prefer AlertConfig email, fall back to user account email
  const toEmail = monitor.alerts?.email ?? monitor.user?.email;
  if (!toEmail) {
    console.warn(`[alert] No email configured for monitor ${monitor.id} — skipping`);
    return;
  }

  const subject =
    alert.type === 'INCIDENT_OPENED'
      ? `🚨 [SentinelMesh] Incident OPENED — ${monitor.name}`
      : `✅ [SentinelMesh] Incident RESOLVED — ${monitor.name}`;

  const html = `
    <h3>${subject}</h3>
    <p><strong>Monitor:</strong> ${monitor.name} (${monitor.url})</p>
    <p><strong>Scope:</strong> ${incident.scope}${incident.region ? ` · ${incident.region}` : ''}</p>
    <p><strong>Status:</strong> ${incident.status}</p>
    <p><strong>Time:</strong> ${new Date().toISOString()}</p>
  `;

  try {
    await sendEmail(toEmail, subject, html);

    await prisma.alert.update({
      where: { id: alert.id },
      data: { status: 'SENT', sentAt: new Date() }
    });
  } catch (err) {
    await prisma.alert.update({
      where: { id: alert.id },
      data: { status: 'FAILED' }
    });
    throw err;
  }
}
