import { NextResponse } from "next/server";
import { fromContainerMetadata } from "@aws-sdk/credential-providers";
import { export_aws_credentials } from "@/utils";

import {
  CreatePresignedDomainUrlCommand,
  CreateUserProfileCommand,
  DescribeUserProfileCommand,
  DescribeUserProfileResponse,
  ListUserProfilesCommand,
  ListUserProfilesRequest,
  SageMakerClient,
  SageMakerClientConfig,
  UserProfileDetails,
  UserSettings,
} from "@aws-sdk/client-sagemaker";

const credentials_ = fromContainerMetadata({ timeout: 2000, maxRetries: 1 });

export async function POST(request: Request) {
  const data = await request.json();
  const credentials = export_aws_credentials(data, credentials_);

  let config = {
    region: "eu-west-2",
    credentials,
  } as SageMakerClientConfig;
  const client = new SageMakerClient(config);
  const input = {
    // CreatePresignedDomainUrlRequest
    DomainId: process.env.NEXT_PUBLIC_AWS_SAGEMAKER_DOMAIN_ID, // required
    UserProfileName: process.env.NEXT_PUBLIC_AWS_SAGEMAKER_USER_NAME, // required
    ExpiresInSeconds: 30,
  };
  const command = new CreatePresignedDomainUrlCommand(input);
  const response = await client.send(command);
  return NextResponse.json({ url: response.AuthorizedUrl }, { status: 200 });
}
