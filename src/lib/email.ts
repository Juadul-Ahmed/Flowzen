
import nodemailer from "nodemailer";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions) {
  const host = process.env.MAILTRAP_HOST;
  const port = Number(process.env.MAILTRAP_PORT);
  const user = process.env.MAILTRAP_USER;
  const password = process.env.MAILTRAP_PASSWORD;
  const from = process.env.EMAIL_FROM;

  if (!host || !port || !user || !password || !from) {
    throw new Error("Mailtrap SMTP environment variables are missing.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: password,
    },
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.info("Email captured by Mailtrap:", info.messageId);

    return info;
  } catch (error) {
    console.error("Mailtrap email delivery failed:", error);
    throw error;
  }
}
