import { NextResponse } from "next/server";
import { fromContainerMetadata } from "@aws-sdk/credential-providers";
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
  SESClientConfig,
} from "@aws-sdk/client-ses";

const credentials_ = fromContainerMetadata({ timeout: 2000, maxRetries: 1 });

export async function POST(request: Request) {
  const data = await request.json();
  let credentials: any = credentials_;
  if (
    "accessKeyId" in data &&
    data.accessKeyId !== "" &&
    "secretAccessKey" in data &&
    data.secretAccessKey !== ""
  ) {
    credentials = (({ accessKeyId, secretAccessKey }) => ({
      accessKeyId,
      secretAccessKey,
    }))(data);
  }

  let config: SESClientConfig = {
    region: "eu-west-2",
    credentials,
  };
  const ses_client = new SESClient(config);

  const input: SendEmailCommandInput = {
    Source: `no-reply@${data.domain_name as string}`,
    Destination: {
      ToAddresses: [data.admin_email as string],
    },
    Message: {
      Subject: {
        Data: "RXScope Website Login Request",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `<body><p>${data.name} (${data.email}): ${data.message}</p></body>`,
          Charset: "UTF-8",
        },
      },
    },
  };
  const command = new SendEmailCommand(input);
  const response = await ses_client.send(command);
  console.log(response);
  return NextResponse.json({ message: "Email sent" }, { status: 200 });
}
