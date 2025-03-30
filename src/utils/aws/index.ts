export function export_aws_credentials(data: any, credentials_: any) {
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

  return credentials;
}
