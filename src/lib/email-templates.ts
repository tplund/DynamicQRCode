const ADMIN_URL = "https://getdynamicqrcode.com/admin";

function wrap(content: string): string {
  return `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
    <div style="margin-bottom:24px;">
      <strong style="font-size:18px;color:#1A2332;">GetDynamicQRCode</strong>
    </div>
    ${content}
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;color:#999;font-size:12px;">
      GetDynamicQRCode — Dynamiske QR-koder med tracking
    </div>
  </div>`;
}

export function welcomeEmailHtml(name: string): string {
  return wrap(`
    <h2 style="color:#1A2332;">Velkommen, ${name}!</h2>
    <p style="color:#555;line-height:1.6;">
      Tak fordi du har oprettet en konto hos GetDynamicQRCode. Du kan nu oprette dynamiske QR-koder
      og tracke scanninger i realtid.
    </p>
    <p style="margin-top:20px;">
      <a href="${ADMIN_URL}" style="display:inline-block;background:#1A2332;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Gå til dit dashboard
      </a>
    </p>
  `);
}

export function paymentReceiptHtml(params: {
  name: string;
  plan: string;
  amount: string;
  date: string;
}): string {
  return wrap(`
    <h2 style="color:#1A2332;">Betalingskvittering</h2>
    <p style="color:#555;">Hej ${params.name}, tak for din betaling.</p>
    <table style="border-collapse:collapse;width:100%;margin-top:16px;">
      <tr style="background:#f8f9fa;">
        <td style="padding:10px 14px;font-weight:bold;border:1px solid #dee2e6;">Plan</td>
        <td style="padding:10px 14px;border:1px solid #dee2e6;">${params.plan}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:bold;border:1px solid #dee2e6;">Beløb</td>
        <td style="padding:10px 14px;border:1px solid #dee2e6;">${params.amount}/month</td>
      </tr>
      <tr style="background:#f8f9fa;">
        <td style="padding:10px 14px;font-weight:bold;border:1px solid #dee2e6;">Dato</td>
        <td style="padding:10px 14px;border:1px solid #dee2e6;">${params.date}</td>
      </tr>
    </table>
    <p style="margin-top:20px;">
      <a href="${ADMIN_URL}" style="color:#1A2332;font-weight:bold;">Gå til dit dashboard</a>
    </p>
  `);
}

export function planChangeHtml(params: {
  name: string;
  oldPlan: string;
  newPlan: string;
  isUpgrade: boolean;
}): string {
  const heading = params.isUpgrade ? "Din plan er opgraderet!" : "Din plan er ændret";
  const color = params.isUpgrade ? "#27ae60" : "#e67e22";

  return wrap(`
    <h2 style="color:${color};">${heading}</h2>
    <p style="color:#555;">Hej ${params.name}, din plan er blevet ændret.</p>
    <table style="border-collapse:collapse;width:100%;margin-top:16px;">
      <tr style="background:#f8f9fa;">
        <td style="padding:10px 14px;font-weight:bold;border:1px solid #dee2e6;">Tidligere plan</td>
        <td style="padding:10px 14px;border:1px solid #dee2e6;">${params.oldPlan}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:bold;border:1px solid #dee2e6;">Ny plan</td>
        <td style="padding:10px 14px;border:1px solid #dee2e6;font-weight:bold;color:${color};">${params.newPlan}</td>
      </tr>
    </table>
    <p style="margin-top:20px;">
      <a href="${ADMIN_URL}" style="color:#1A2332;font-weight:bold;">Gå til dit dashboard</a>
    </p>
  `);
}
