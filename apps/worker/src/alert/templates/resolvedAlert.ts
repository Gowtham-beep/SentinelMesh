/**
 * Formats a Date as "14 Mar 2026, 03:42 AM IST"
 */
function formatIST(date: Date): string {
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    }).replace(',', '') + ' IST';
}

export type ResolvedAlertVars = {
    monitor_name: string;
    monitor_url: string;
    monitor_id: string;
    incident_id: string;
    opened_at: Date;
    resolved_at: Date;
    /** Duration string, e.g. "12m 34s" */
    downtime_duration: string;
    dashboard_url: string;
    unsubscribe_url: string;
};

export function buildResolvedAlertHtml(vars: ResolvedAlertVars): string {
    const {
        monitor_name,
        monitor_url,
        monitor_id,
        incident_id,
        opened_at,
        resolved_at,
        downtime_duration,
        dashboard_url,
        unsubscribe_url,
    } = vars;

    const shortId = incident_id.replace(/-/g, '').substring(0, 8).toUpperCase();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Incident Resolved — SentinelMesh</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Courier New',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border:1px solid #1f1f1f;border-radius:8px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #1f1f1f;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color:#ffffff;font-family:'Courier New',monospace;font-size:16px;font-weight:bold;letter-spacing:0.05em;">SentinelMesh</span>
                  </td>
                  <td align="right">
                    <span style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);color:#22c55e;font-family:'Courier New',monospace;font-size:11px;padding:4px 10px;border-radius:4px;letter-spacing:0.1em;">&#10003; INCIDENT RESOLVED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 8px;color:#a1a1aa;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Monitor Recovery</p>
              <h1 style="margin:0 0 16px;color:#ffffff;font-family:'Courier New',monospace;font-size:22px;font-weight:bold;line-height:1.3;">${escape(monitor_name)} is back online</h1>
              <p style="margin:0;color:#a1a1aa;font-family:'Courier New',monospace;font-size:13px;line-height:1.6;">SentinelMesh has confirmed that your monitor is responding normally again. The incident has been automatically closed.</p>
            </td>
          </tr>

          <!-- Incident Details -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.15);border-radius:6px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 16px;color:#22c55e;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Incident Summary</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;width:140px;">Monitor</td>
                        <td style="padding:6px 0;color:#ffffff;font-family:'Courier New',monospace;font-size:12px;">${escape(monitor_name)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;">URL</td>
                        <td style="padding:6px 0;color:#06b6d4;font-family:'Courier New',monospace;font-size:12px;">${escape(monitor_url)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;">Incident Started</td>
                        <td style="padding:6px 0;color:#a1a1aa;font-family:'Courier New',monospace;font-size:12px;">${formatIST(opened_at)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;">Resolved At</td>
                        <td style="padding:6px 0;color:#22c55e;font-family:'Courier New',monospace;font-size:12px;">${formatIST(resolved_at)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;">Total Downtime</td>
                        <td style="padding:6px 0;color:#ffffff;font-family:'Courier New',monospace;font-size:12px;">${escape(downtime_duration)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;">Incident ID</td>
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;">${shortId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#22c55e;border-radius:6px;">
                    <a href="${dashboard_url}/monitors/${monitor_id}" style="display:inline-block;padding:12px 24px;color:#000000;font-family:'Courier New',monospace;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:0.05em;">View Monitor &#8594;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #1f1f1f;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:#52525b;font-family:'Courier New',monospace;font-size:11px;">SentinelMesh — Monitoring you can actually trust</p>
                  </td>
                  <td align="right">
                    <a href="${unsubscribe_url}" style="color:#52525b;font-family:'Courier New',monospace;font-size:11px;text-decoration:none;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Simple HTML entity escaper */
function escape(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/** Compute human-readable duration between two dates, e.g. "12m 34s" */
export function computeDuration(start: Date, end: Date): string {
    const totalSeconds = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
}
