export async function create_presigned_url() {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch(`/api/private/service/ai`, {
    method: "POST",
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
