import { NextResponse } from "next/server";
import { fromContainerMetadata } from "@aws-sdk/credential-providers";
import { export_aws_credentials } from "@/utils";

import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
  DeliveryMediumType,
  MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  SESClient,
  VerifyEmailIdentityCommand,
  DeleteIdentityCommand,
} from "@aws-sdk/client-ses";

const credentials_ = fromContainerMetadata({ timeout: 2000, maxRetries: 1 });

export async function POST(request: Request) {
  const data = await request.json();
  const credentials = export_aws_credentials(data, credentials_);
  let config = {
    region: "eu-west-2",
    credentials,
  };
  const client = new CognitoIdentityProviderClient(config);
  const sesclient = new SESClient(config);
  const input = {
    UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOL_ID,
    Username: data.username,
    UserAttributes: [
      {
        Name: "name",
        Value: "email",
      },
      {
        Name: "email",
        Value: data.email as string,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    DesiredDeliveryMediums: ["EMAIL"] as DeliveryMediumType[],
    MessageAction: "SUPPRESS" as MessageActionType,
  };
  const command = new AdminCreateUserCommand(input);
  const response = await client.send(command);
  const sescmd = new VerifyEmailIdentityCommand({
    EmailAddress: data.email as string,
  });
  const sesresp = await sesclient.send(sescmd);
  console.log(sesresp);

  return NextResponse.json(response["User"], { status: 200 });
}

export async function DELETE(request: Request) {
  const data = await request.json();
  const credentials = export_aws_credentials(data, credentials_);
  let config = {
    region: "eu-west-2",
    credentials,
  };
  const client = new CognitoIdentityProviderClient(config);
  const sesclient = new SESClient(config);
  const input = {
    UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOL_ID,
    Username: data.username as string,
  };
  const command = new AdminDeleteUserCommand(input);
  const response = await client.send(command);
  const sescmd = new DeleteIdentityCommand({ Identity: data.email as string });
  const sesresp = await sesclient.send(sescmd);
  console.log("hello", response, sesresp);

  return NextResponse.json({}, { status: 200 });
}
