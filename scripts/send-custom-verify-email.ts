import {
  SESClient,
  SendCustomVerificationEmailCommand,
} from "@aws-sdk/client-ses";

const client = new SESClient({ region: "eu-west-2" });

async function sendCustomVerificationEmail(
  email: string,
  templateName: string,
) {
  const command = new SendCustomVerificationEmailCommand({
    EmailAddress: email,
    TemplateName: templateName,
  });

  try {
    const response = await client.send(command);
    console.log("Custom verification email sent successfully:", response);
  } catch (error) {
    console.error("Error sending custom verification email:", error);
  }
}

const email = "leo.leung@faculty.ai";
const templateName = "VerificationTemplate";

sendCustomVerificationEmail(email, templateName);
