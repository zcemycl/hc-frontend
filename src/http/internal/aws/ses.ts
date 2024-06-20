import { IRequestDemoForm } from "@/types/home";

export async function sendEmail(requestForm: IRequestDemoForm) {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch(`/api/request_demo`, {
    method: "POST",
    body: JSON.stringify({
      name: requestForm.name,
      email: requestForm.email,
      message: requestForm.message,
      domain_name: process.env.NEXT_PUBLIC_DOMAIN_NAME,
      admin_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
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
