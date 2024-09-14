import { cookies } from "next/headers";

export function get_token_cookie() {
  const cookie = cookies();
  if (!cookie.has("token")) {
    throw new Error("Missing token cookie");
  }
  const token = cookie.get("token")?.value;
  return token;
}

export function validate_response_ok(response: any) {
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
}
