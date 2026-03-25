const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "tlund@elearningspecialist.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "hello@getdynamicqrcode.com";

export async function sendMail(params: {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}) {
  const apiKey = process.env.MAILJET_API_KEY;
  const apiSecret = process.env.MAILJET_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn("[notify] MAILJET credentials not set — skipping email");
    return;
  }

  try {
    const Mailjet = require("node-mailjet");
    const mailjet = Mailjet.apiConnect(apiKey, apiSecret);

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: FROM_EMAIL, Name: "GetDynamicQRCode" },
          To: [{ Email: params.to.email, Name: params.to.name || "" }],
          Subject: params.subject,
          HTMLPart: params.htmlContent,
        },
      ],
    });
    console.log(`[notify] Email sent: ${params.subject}`);
  } catch (err) {
    console.error("[notify] Failed to send email:", err);
  }
}

export async function notifyBrokenRedirect({
  slug,
  userAgent,
  country,
  referer,
  url,
}: {
  slug: string;
  userAgent: string | null;
  country: string | null;
  referer: string | null;
  url: string;
}) {
  await sendMail({
    to: { email: NOTIFY_EMAIL, name: "Thomas" },
    subject: `⚠️ Ukendt QR-kode: /${slug}`,
    htmlContent: `
    <div style="font-family:sans-serif;max-width:600px;">
      <h2 style="color:#c0392b;">En bruger ramte en ukendt QR-kode</h2>
      <table style="border-collapse:collapse;width:100%;">
        <tr style="background:#f8f9fa;"><td style="padding:8px 12px;font-weight:bold;border:1px solid #dee2e6;">Slug</td><td style="padding:8px 12px;border:1px solid #dee2e6;">/${slug}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #dee2e6;">Fuld URL</td><td style="padding:8px 12px;border:1px solid #dee2e6;">${url}</td></tr>
        <tr style="background:#f8f9fa;"><td style="padding:8px 12px;font-weight:bold;border:1px solid #dee2e6;">Land</td><td style="padding:8px 12px;border:1px solid #dee2e6;">${country || "Ukendt"}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #dee2e6;">Referer</td><td style="padding:8px 12px;border:1px solid #dee2e6;">${referer || "Ingen"}</td></tr>
        <tr style="background:#f8f9fa;"><td style="padding:8px 12px;font-weight:bold;border:1px solid #dee2e6;">Browser</td><td style="padding:8px 12px;border:1px solid #dee2e6;font-size:12px;">${userAgent || "Ukendt"}</td></tr>
      </table>
      <p style="margin-top:16px;color:#666;">💡 Opret evt. QR-koden i <a href="https://qr.activatelms.com/admin">admin-panelet</a>.</p>
    </div>
    `,
  });
}

export async function notifyDestination404({
  slug,
  destinationUrl,
  statusCode,
}: {
  slug: string;
  destinationUrl: string;
  statusCode: number;
}) {
  await sendMail({
    to: { email: NOTIFY_EMAIL, name: "Thomas" },
    subject: `⚠️ Død destination: /${slug}`,
    htmlContent: `
    <div style="font-family:sans-serif;max-width:600px;">
      <h2 style="color:#e67e22;">En QR-kode peger på en utilgængelig side</h2>
      <table style="border-collapse:collapse;width:100%;">
        <tr style="background:#f8f9fa;"><td style="padding:8px 12px;font-weight:bold;border:1px solid #dee2e6;">QR Slug</td><td style="padding:8px 12px;border:1px solid #dee2e6;">/${slug}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #dee2e6;">Destination</td><td style="padding:8px 12px;border:1px solid #dee2e6;">${destinationUrl}</td></tr>
        <tr style="background:#f8f9fa;"><td style="padding:8px 12px;font-weight:bold;border:1px solid #dee2e6;">HTTP Status</td><td style="padding:8px 12px;border:1px solid #dee2e6;color:#c0392b;font-weight:bold;">${statusCode === 0 ? "Utilgængelig" : statusCode}</td></tr>
      </table>
      <p style="margin-top:16px;color:#666;">🔧 Ret destination-URL i <a href="https://qr.activatelms.com/admin">admin-panelet</a>.</p>
    </div>
    `,
  });
}
