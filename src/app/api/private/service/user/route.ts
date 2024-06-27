import { NextResponse } from "next/server";
import { fromContainerMetadata } from "@aws-sdk/credential-providers";
import { export_aws_credentials } from "@/utils";

import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";

const credentials_ = fromContainerMetadata({ timeout: 2000, maxRetries: 1 });

export async function POST(request: Request) {
  const data = await request.json();
  const credentials = export_aws_credentials(data, credentials_);
  let config = {
    region: "eu-west-2",
    credentials,
  } as CognitoIdentityProviderClientConfig;
  const client = new CognitoIdentityProviderClient(config);
  const input = {
    UserPoolId: "eu-west-2_wYaHLvNIY",
    Username: data.username,
    UserAttributes: [
      {
        Name: "name",
        Value: "email",
      },
      {
        Name: "email",
        Value: data.email,
      },
    ],
  };
  const command = new AdminCreateUserCommand(input);
  const response = await client.send(command);

  return NextResponse.json(response["User"], { status: 200 });
}

export async function DELETE(request: Request) {
  const data = await request.json();
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const credentials = export_aws_credentials(data, credentials_);
  let config = {
    region: "eu-west-2",
    credentials,
  } as CognitoIdentityProviderClientConfig;
  const client = new CognitoIdentityProviderClient(config);
  const input = {
    UserPoolId: "eu-west-2_wYaHLvNIY",
    Username: name as string,
  };
  const command = new AdminDeleteUserCommand(input);
  const response = await client.send(command);
  console.log("hello", response);

  return NextResponse.json({}, { status: 200 });
}
