export async function delete_user(username: string, token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const resp = await fetch(`/api/private/service/user?name=${username}`, {
    method: "DELETE",
    body: JSON.stringify({
      accessKeyId:
        process.env.NEXT_PUBLIC_ENV_NAME === "local-dev"
          ? process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID
          : "",
      secretAccessKey:
        process.env.NEXT_PUBLIC_ENV_NAME === "local-dev"
          ? process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
          : "",
    }),
    headers,
  });
  return await resp.json();
}
