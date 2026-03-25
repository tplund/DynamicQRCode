import { sendMail } from "./notify";
import { welcomeEmailHtml, paymentReceiptHtml, planChangeHtml } from "./email-templates";

export async function sendWelcomeEmail(email: string, name: string) {
  await sendMail({
    to: { email, name },
    subject: "Velkommen til GetDynamicQRCode!",
    htmlContent: welcomeEmailHtml(name),
  });
}

export async function sendPaymentReceipt(
  email: string,
  params: { name: string; plan: string; amount: string }
) {
  await sendMail({
    to: { email, name: params.name },
    subject: `Betalingskvittering — ${params.plan}`,
    htmlContent: paymentReceiptHtml({
      ...params,
      date: new Date().toLocaleDateString("da-DK"),
    }),
  });
}

export async function sendPlanChangeNotification(
  email: string,
  params: { name: string; oldPlan: string; newPlan: string }
) {
  const isUpgrade = params.newPlan !== "Gratis";
  await sendMail({
    to: { email, name: params.name },
    subject: isUpgrade
      ? `Din plan er opgraderet til ${params.newPlan}!`
      : "Din plan er ændret",
    htmlContent: planChangeHtml({ ...params, isUpgrade }),
  });
}
