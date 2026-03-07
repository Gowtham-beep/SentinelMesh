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

export type DownAlertVars = {
    monitor_name: string;
    monitor_url: string;
    monitor_id: string;
    status_code: string | number | null;
    error_message: string | null;
    detected_at: Date;
    incident_id: string;
    dashboard_url: string;
    unsubscribe_url: string;
};

export function buildDownAlertHtml(vars: DownAlertVars): string {
    const {
        monitor_name,
        monitor_url,
        monitor_id,
        status_code,
        error_message,
        detected_at,
        incident_id,
        dashboard_url,
        unsubscribe_url,
    } = vars;

    // Short UUID: first 8 chars
    const shortId = incident_id.replace(/-/g, '').substring(0, 8).toUpperCase();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Incident Alert — SentinelMesh</title>
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
                    <span style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#ef4444;font-family:'Courier New',monospace;font-size:11px;padding:4px 10px;border-radius:4px;letter-spacing:0.1em;">&#9679; INCIDENT OPENED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 8px;color:#a1a1aa;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Monitor Alert</p>
              <h1 style="margin:0 0 16px;color:#ffffff;font-family:'Courier New',monospace;font-size:22px;font-weight:bold;line-height:1.3;">${escape(monitor_name)} is unreachable</h1>
              <p style="margin:0;color:#a1a1aa;font-family:'Courier New',monospace;font-size:13px;line-height:1.6;">SentinelMesh has confirmed downtime after consecutive verification checks from multiple workers. This is not a false positive.</p>
            </td>
          </tr>

          <!-- Incident Details -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.15);border-radius:6px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 16px;color:#ef4444;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Incident Details</p>
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
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;">Status Code</td>
                        <td style="padding:6px 0;color:#ef4444;font-family:'Courier New',monospace;font-size:12px;">${status_code ?? '—'}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;">Error</td>
                        <td style="padding:6px 0;color:#a1a1aa;font-family:'Courier New',monospace;font-size:12px;">${escape(error_message ?? '—')}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#52525b;font-family:'Courier New',monospace;font-size:12px;">Detected At</td>
                        <td style="padding:6px 0;color:#ffffff;font-family:'Courier New',monospace;font-size:12px;">${formatIST(detected_at)}</td>
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
                  <td style="background:#06b6d4;border-radius:6px;">
                    <a href="${dashboard_url}/monitors/${monitor_id}" style="display:inline-block;padding:12px 24px;color:#000000;font-family:'Courier New',monospace;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:0.05em;">View Incident &#8594;</a>
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

/** Simple HTML entity escaper to prevent XSS from monitor data */
function escape(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
