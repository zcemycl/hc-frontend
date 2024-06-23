import { NextResponse } from "next/server";
import { fromContainerMetadata } from "@aws-sdk/credential-providers";
import { export_aws_credentials } from "@/utils";

import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

const credentials_ = fromContainerMetadata({ timeout: 2000, maxRetries: 1 });

export async function POST(request: Request) {
  const data = await request.json();
  const credentials = export_aws_credentials(data, credentials_);
  return NextResponse.json({}, { status: 200 });
}

export async function DELETE(request: Request) {
  const data = await request.json();
  const credentials = export_aws_credentials(data, credentials_);
  return NextResponse.json({}, { status: 200 });
}
