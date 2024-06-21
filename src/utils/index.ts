export function convert_datetime_to_date(datetime: string) {
  return new Date(datetime).toLocaleDateString();
}

export async function dummy_cred() {
  const openid_conf_uri = process.env.NEXT_PUBLIC_COGNITO_OPENID_CONF_URI;
  const openid_conf = await (await fetch(openid_conf_uri as string)).json();
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", "fake");
  params.append("client_secret", "fake");
  params.append("mock_type", "user");
  const resp = await fetch(openid_conf.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const access_token = (await resp.json()).access_token;
  return access_token;
}
