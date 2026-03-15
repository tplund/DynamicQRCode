import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "thomas@activatelms.com";

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
  if (!process.env.RESEND_API_KEY) {
    console.warn("[notify] RESEND_API_KEY not set — skipping email");
    return;
  }

  try {
    await resend.emails.send({
      from: "DynamicQR <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject: `⚠️ Broken QR redirect: /${slug}`,
      html: `
        <h2>En bruger ramte en ukendt QR-kode</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:4px 12px;font-weight:bold;">Slug</td><td style="padding:4px 12px;">/${slug}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">URL</td><td style="padding:4px 12px;">${url}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Land</td><td style="padding:4px 12px;">${country || "Ukendt"}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Referer</td><td style="padding:4px 12px;">${referer || "Ingen"}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">User Agent</td><td style="padding:4px 12px;">${userAgent || "Ukendt"}</td></tr>
        </table>
        <p style="margin-top:16px;color:#666;">Tjek om der mangler en QR-kode i <a href="https://qr.activatelms.com/admin">admin-panelet</a>.</p>
      `,
    });
    console.log(`[notify] Sent broken redirect alert for /${slug}`);
  } catch (err) {
    console.error("[notify] Failed to send email:", err);
  }
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
  if (!process.env.RESEND_API_KEY) {
    console.warn("[notify] RESEND_API_KEY not set — skipping email");
    return;
  }

  try {
    await resend.emails.send({
      from: "DynamicQR <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject: `⚠️ Destination 404: /${slug} → ${destinationUrl}`,
      html: `
        <h2>En QR-kode peger på en død destination</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:4px 12px;font-weight:bold;">Slug</td><td style="padding:4px 12px;">/${slug}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Destination</td><td style="padding:4px 12px;">${destinationUrl}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Status kode</td><td style="padding:4px 12px;">${statusCode}</td></tr>
        </table>
        <p style="margin-top:16px;color:#666;">Ret destination-URL'en i <a href="https://qr.activatelms.com/admin">admin-panelet</a>.</p>
      `,
    });
    console.log(`[notify] Sent destination 404 alert for /${slug}`);
  } catch (err) {
    console.error("[notify] Failed to send email:", err);
  }
}
