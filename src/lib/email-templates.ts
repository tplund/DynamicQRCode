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

// --- Lead nurture drip emails ---

const SIGNUP_URL = "https://getdynamicqrcode.com/login";

export function leadWelcomeEmailHtml(): string {
  return wrap(`
    <h2 style="color:#1A2332;">Your QR code is ready!</h2>
    <p style="color:#555;line-height:1.6;">
      Thanks for trying our free QR code generator. Your code is a <strong>static</strong> QR code &mdash;
      meaning the URL is baked in permanently.
    </p>
    <p style="color:#555;line-height:1.6;">
      But what happens when that URL changes? The QR code breaks. And if it's already printed on
      packaging, signage, or business cards &mdash; there's no way to fix it.
    </p>
    <p style="color:#555;line-height:1.6;">
      With a <strong>dynamic QR code</strong>, you can update the destination anytime &mdash; without reprinting.
    </p>
    <p style="margin-top:20px;">
      <a href="${SIGNUP_URL}" style="display:inline-block;background:#1A2332;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Create a free dynamic QR code
      </a>
    </p>
    <p style="margin-top:16px;color:#999;font-size:13px;">Free plan includes 3 dynamic QR codes. No credit card required.</p>
  `);
}

export function leadDrip1Html(): string {
  return wrap(`
    <h2 style="color:#1A2332;">When QR codes go wrong</h2>
    <p style="color:#555;line-height:1.6;">
      Imagine this: you're at a nature trail, and you scan a QR code on an information sign. Instead of
      useful info, you get a 404 &mdash; page not found. That's what happens with static QR codes when
      the destination changes.
    </p>
    <p style="color:#555;line-height:1.6;">
      This happens more than you'd think. Municipalities, event organizers, and businesses print
      thousands of QR codes every year that eventually go dead.
    </p>
    <p style="color:#555;line-height:1.6;">
      A <strong>dynamic QR code</strong> solves this. Change the destination in seconds. The printed
      code stays the same. No reprinting. No dead links.
    </p>
    <p style="margin-top:20px;">
      <a href="${SIGNUP_URL}" style="display:inline-block;background:#1A2332;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Try it free &mdash; 3 dynamic QR codes
      </a>
    </p>
  `);
}

export function leadDrip2Html(): string {
  return wrap(`
    <h2 style="color:#1A2332;">Know who scans your codes</h2>
    <p style="color:#555;line-height:1.6;">
      With a static QR code, you have zero visibility. Is anyone scanning it? Which country? Which device?
      You're flying blind.
    </p>
    <p style="color:#555;line-height:1.6;">
      GetDynamicQRCode gives you <strong>real-time analytics</strong> for every scan: country, device,
      time of day. See what works and optimize.
    </p>
    <p style="color:#555;line-height:1.6;">
      Plus, you get <strong>email alerts</strong> if a destination goes down &mdash; so you'll never have
      a broken QR code without knowing about it.
    </p>
    <p style="margin-top:20px;">
      <a href="${SIGNUP_URL}" style="display:inline-block;background:#1A2332;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Start tracking your QR codes
      </a>
    </p>
    <p style="margin-top:16px;color:#999;font-size:13px;">Free forever. Upgrade only if you need more.</p>
  `);
}
