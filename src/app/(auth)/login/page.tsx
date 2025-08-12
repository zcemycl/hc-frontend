"use server";
import { LocalGenericProvider } from "@/contexts";
import Component from "./component";
import { cookies } from "next/headers";
import { SiteMode } from "@/types";

type TLoginSearchParams = {
  code?: string;
  email?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<TLoginSearchParams>;
}) {
  // from url parameters
  const searchParams_map = await searchParams;
  const urlEmail = decodeURIComponent(
    searchParams_map.email ? searchParams_map.email : "",
  );
  const urlCode = searchParams_map.code ? searchParams_map.code : "";
  console.log(`login page ssr message ... ${JSON.stringify(searchParams_map)}`);
  // from cookies
  const cookie = cookies();
  const modeCookie = cookie.get("mode");
  const hasModeCookie = modeCookie && modeCookie.value != "";
  const defaultMode = hasModeCookie ? modeCookie.value : SiteMode.LOGIN;

  const emailCookie = cookie.get("email");
  const hasEmailCookie = emailCookie && emailCookie.value != "";
  const defaultEmail = hasEmailCookie ? emailCookie.value : "";

  const cognito_user_cookie = cookie.get("cognito_user");
  const hasCognitoCookie =
    cognito_user_cookie && cognito_user_cookie.value != "";
  const cognito_user = hasCognitoCookie ? cognito_user_cookie.value : "{}";

  return (
    <LocalGenericProvider
      initialData={{
        urlEmail,
        urlCode,
        defaultMode,
        defaultEmail,
        cognito_user,
      }}
    >
      <Component />
    </LocalGenericProvider>
  );
}
