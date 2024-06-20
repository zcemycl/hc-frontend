import { NextResponse } from "next/server";
import { fromContainerMetadata } from "@aws-sdk/credential-providers";

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
const rolearn =
  "arn:aws:iam::975050053093:role/terraform-20240619075858415000000001";

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

  let config = {
    region: "eu-west-2",
    credentials,
  } as SageMakerClientConfig;
  const client = new SageMakerClient(config);
  const input = {
    // CreatePresignedDomainUrlRequest
    DomainId: "d-oa2xxqb4psru", // required
    UserProfileName: "leo-leung-test", // required
    ExpiresInSeconds: 30,
  };
  const command = new CreatePresignedDomainUrlCommand(input);
  const response = await client.send(command);
  return NextResponse.json({ url: response.AuthorizedUrl }, { status: 200 });
}
