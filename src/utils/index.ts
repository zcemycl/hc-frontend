import { ITherapeuticAreaGroupTables, IUnAnnotatedAETable } from "@/types";

export function convert_datetime_to_date(datetime: string) {
  return new Date(datetime).toLocaleDateString();
}

export function convert_datetime_to_simple(datetime: string) {
  return new Date(datetime).toLocaleString();
}

export async function dummy_cred(username: string) {
  const openid_conf_uri = process.env.NEXT_PUBLIC_COGNITO_OPENID_CONF_URI;
  const openid_conf = await (await fetch(openid_conf_uri as string)).json();
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", "fake");
  params.append("client_secret", "fake");
  params.append("mock_type", username);
  const resp = await fetch(openid_conf.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const res = await resp.json();
  const access_token = res.access_token;
  return access_token;
}

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

export const transformData = (list: IUnAnnotatedAETable[]) => {
  return list.reduce(
    (
      acc: ITherapeuticAreaGroupTables,
      item: IUnAnnotatedAETable,
      curIdx: number,
    ) => {
      const key = String(item.therapeutic_area!.name) as string;
      if (!acc[key]) {
        acc[key] = [];
      }
      item.relative_idx = curIdx;
      acc[key].push(item);
      return acc;
    },
    {},
  );
};
