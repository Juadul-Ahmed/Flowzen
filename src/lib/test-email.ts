import "dotenv/config";
import { sendEmail } from "./email";

async function main() {
  await sendEmail({
    to: process.env.SMTP_USER!,
    subject: "Flowzen Gmail SMTP Test",
    html: `
      <h1>Flowzen Email Test</h1>
      <p>Gmail SMTP is working successfully!</p>
    `,
  });
}

main().catch(console.error);