import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function get_token_cookie() {
  const cookie = cookies();
  if (!cookie.has("token")) {
    // throw new Error("Missing token cookie");
    // avoiding loop from home to logout in local test
    if (process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev") redirect("/logout");
    return "";
  }
  const token = cookie.get("token")?.value;
  return token;
}

export function validate_response_ok(response: any) {
  if (!response.ok) {
    if (response.status == 401) {
      redirect("/logout");
    }
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
}
