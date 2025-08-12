"use server";

import { LocalGenericProvider } from "@/contexts";
import Component from "./component";
import { cookies } from "next/headers";
import { SiteMode } from "@/types";

export default async function Page() {
  const cookie = cookies();
  const modeCookie = cookie.get("mode");
  const hasModeCookie = modeCookie && modeCookie.value != "";
  const defaultMode = hasModeCookie ? modeCookie.value : SiteMode.LOGIN;
  return (
    <LocalGenericProvider initialData={{ defaultMode }}>
      <Component />
    </LocalGenericProvider>
  );
}
