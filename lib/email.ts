import { Resend } from "resend";

import { prisma } from "@/lib/prisma";
import { formatRegistrationRef } from "@/lib/workshop";

let client: Resend | null = null;

function getResend(): Resend {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");
  client = new Resend(apiKey);
  return client;
}

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? "Summit Socials <onboarding@resend.dev>";
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

type SendResult = { sent: boolean; reason?: string };

/**
 * Send the confirmation email for a registration, exactly once.
 *
 * Only sends when the payment is verified PAID. Idempotency is enforced in
 * the database: the row is claimed by setting `confirmationEmailSentAt` in a
 * conditional update before the email goes out, and the claim is released if
 * the send fails so a later retry (e.g. a Stripe webhook redelivery) can try
 * again.
 */
export async function sendConfirmationEmail(
  registrationId: string,
): Promise<SendResult> {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { workshop: true, payment: true, user: true },
  });

  if (!registration || !registration.payment) {
    return { sent: false, reason: "registration-or-payment-missing" };
  }
  if (registration.payment.status !== "PAID") {
    return { sent: false, reason: "payment-not-paid" };
  }

  // Atomically claim the send. count === 0 means it is already claimed/sent.
  const claim = await prisma.payment.updateMany({
    where: {
      id: registration.payment.id,
      status: "PAID",
      confirmationEmailSentAt: null,
    },
    data: { confirmationEmailSentAt: new Date() },
  });
  if (claim.count === 0) {
    return { sent: false, reason: "already-sent" };
  }

  const ref = formatRegistrationRef(registration.id);
  const dateText = DATE_FORMAT.format(registration.workshop.date);
  const recipientName = registration.fullName || registration.user.name || "there";

  try {
    const { error } = await getResend().emails.send({
      from: fromAddress(),
      to: registration.email,
      subject: "Your place at Prompt to Product is confirmed",
      text: buildText({
        name: recipientName,
        workshop: registration.workshop.title,
        date: dateText,
        location: registration.workshop.location,
        ref,
      }),
      html: buildHtml({
        name: recipientName,
        workshop: registration.workshop.title,
        date: dateText,
        location: registration.workshop.location,
        ref,
      }),
    });

    if (error) {
      throw new Error(`Resend error: ${error.name} — ${error.message}`);
    }

    return { sent: true };
  } catch (error) {
    // Release the claim so the send can be retried.
    await prisma.payment.updateMany({
      where: { id: registration.payment.id },
      data: { confirmationEmailSentAt: null },
    });
    console.error("[email] confirmation send failed:", error);
    throw error;
  }
}

type EmailFields = {
  name: string;
  workshop: string;
  date: string;
  location: string;
  ref: string;
};

function buildText(f: EmailFields): string {
  return [
    "SUMMIT SOCIALS",
    "REGISTRATION CONFIRMED",
    "",
    `Hi ${f.name},`,
    "",
    "Your place at Prompt to Product is confirmed. Keep this email for your records.",
    "",
    `WORKSHOP      ${f.workshop}`,
    `DATE          ${f.date}`,
    `LOCATION      ${f.location}`,
    `REGISTRATION  ${f.ref}`,
    `PAYMENT       Paid`,
    "",
    "See you there.",
    "",
    "—",
    "Summit Socials",
    "Connecting builders, shipping tomorrow's tech.",
  ].join("\n");
}

function buildHtml(f: EmailFields): string {
  const sans =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const serif = "Georgia,'Times New Roman',serif";
  const mono = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:11px 0;border-top:1px solid #e2e6ea;font:11px/1.4 ${mono};letter-spacing:0.08em;color:#8a93a2;text-transform:uppercase;width:132px;vertical-align:top;">${label}</td>
      <td style="padding:11px 0;border-top:1px solid #e2e6ea;font:15px/1.5 ${sans};color:#191f28;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #d8dde3;border-radius:8px;">
          <tr>
            <td style="padding:32px 32px 0;font:500 20px/1.2 ${serif};color:#191f28;">Summit Socials</td>
          </tr>
          <tr>
            <td style="padding:14px 32px 0;font:11px/1 ${mono};font-weight:500;letter-spacing:0.12em;color:#8a93a2;text-transform:uppercase;">Registration confirmed</td>
          </tr>
          <tr>
            <td style="padding:18px 32px 0;font:15px/1.6 ${sans};color:#566173;">
              Hi ${f.name},<br /><br />
              Your place at Prompt to Product is confirmed. Keep this email for your records.
            </td>
          </tr>
          <tr>
            <td style="padding:22px 32px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Workshop", f.workshop)}
                ${row("Date", f.date)}
                ${row("Location", f.location)}
                ${row("Registration", f.ref)}
                ${row("Payment", "Paid")}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 32px;font:14px/1.6 ${sans};color:#8a93a2;">
              See you there.
            </td>
          </tr>
        </table>
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td style="padding:16px 32px 0;font:12px/1.5 ${sans};color:#8a93a2;">
              Summit Socials &middot; Connecting builders, shipping tomorrow&rsquo;s tech.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
