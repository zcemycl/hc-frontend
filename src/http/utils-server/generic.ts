"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function get_token_cookie() {
  const cookie = cookies();
  if (!cookie.has("token")) {
    // throw new Error("Missing token cookie");
    // avoiding loop from home to logout in local test
    console.log("get token cookie XX trigger");
    // if (process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev") redirect("/logout");
    return "";
  }
  const token = cookie.get("token")?.value;
  return token;
}

export async function validate_response_ok(response: any) {
  if (!response.ok) {
    if (response.status == 401) {
      console.log("401 validate_response_ok XX trigger");
      //   redirect("/logout");
    }
    if (response.status == 404) {
      // return {"message": "Not Found"}
    }
    // throw new Error(`Failed to fetch data: ${response.statusText}`);
    return false;
  }
  return true;
}

export async function defineCookieAttr<T>(
  cookiename: string,
  parser?: (raw: string) => T,
): Promise<[boolean, T | null]> {
  const cookie = cookies();
  let has_ = false,
    target = null;
  const targetCookie = cookie.get(cookiename);
  has_ = !!targetCookie && targetCookie.value != "";
  if (!!parser) {
    target = has_ ? parser(targetCookie!.value) : null;
  } else {
    target = has_ ? targetCookie!.value : null;
  }
  return [has_, target as T];
}
