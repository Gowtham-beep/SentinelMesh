import prisma from 'db';
import { sendEmail } from './email.js';
import { buildDownAlertHtml } from './templates/downAlert.js';
import { buildResolvedAlertHtml, computeDuration } from './templates/resolvedAlert.js';

const DASHBOARD_URL =
  (process.env.DASHBOARD_URL ?? 'https://sentinelmesh.app').replace(/\/$/, '');

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
            },
          },
        },
      },
    },
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

  // ── Build email content ────────────────────────────────────────────────────

  let subject: string;
  let html: string;

  if (alert.type === 'INCIDENT_OPENED') {
    subject = `🚨 [SentinelMesh] Incident OPENED — ${monitor.name}`;

    // Fetch the most recent failed CheckResult for this monitor
    const lastCheck = await prisma.checkResult.findFirst({
      where: { monitorId: monitor.id },
      orderBy: { checkedAt: 'desc' },
    });

    html = buildDownAlertHtml({
      monitor_name: monitor.name,
      monitor_url: monitor.url,
      monitor_id: monitor.id,
      status_code: lastCheck?.statusCode ?? null,
      error_message: lastCheck?.error ?? null,
      detected_at: incident.openedAt,
      incident_id: incident.id,
      dashboard_url: DASHBOARD_URL,
      unsubscribe_url: `${DASHBOARD_URL}/settings`,
    });
  } else {
    subject = `✅ [SentinelMesh] Incident RESOLVED — ${monitor.name}`;

    const resolvedAt = incident.closedAt ?? new Date();

    html = buildResolvedAlertHtml({
      monitor_name: monitor.name,
      monitor_url: monitor.url,
      monitor_id: monitor.id,
      incident_id: incident.id,
      opened_at: incident.openedAt,
      resolved_at: resolvedAt,
      downtime_duration: computeDuration(incident.openedAt, resolvedAt),
      dashboard_url: DASHBOARD_URL,
      unsubscribe_url: `${DASHBOARD_URL}/settings`,
    });
  }

  // ── Send & update status ───────────────────────────────────────────────────

  try {
    await sendEmail(toEmail, subject, html);

    await prisma.alert.update({
      where: { id: alert.id },
      data: { status: 'SENT', sentAt: new Date() },
    });
  } catch (err) {
    await prisma.alert.update({
      where: { id: alert.id },
      data: { status: 'FAILED' },
    });
    throw err;
  }
}
