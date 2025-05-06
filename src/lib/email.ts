import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_DOMAIN =
  "NimbusAuth <" +
  (process.env.RESEND_DOMAIN || "no-reply@nimbusauth.com") +
  ">";
console.log("RESEND_DOMAIN", RESEND_DOMAIN);

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set in environment variables");
}

const resend = new Resend(RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_DOMAIN,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendEmail:", error);
    throw new Error("Failed to send email");
  }
}
