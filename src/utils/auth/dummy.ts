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
