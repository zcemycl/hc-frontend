"use server";
import { fetchFdalabelCountv2, fetchUserCountv2 } from "@/http/backend";
import Component from "./component";
import { cookies } from "next/headers";
import { LocalGenericProvider } from "@/contexts";

export default async function Page() {
  const cookie = cookies();
  console.log("000. SSR cookies:", cookie.getAll());
  const drugCountCookie = cookie.get("drug-count");
  const hasFdalabelCountCookie = drugCountCookie && drugCountCookie.value != "";
  const userCountCookie = cookie.get("user-count");
  const hasUserCountCookie = userCountCookie && userCountCookie.value != "";

  const fdalabelCount = hasFdalabelCountCookie
    ? Number(drugCountCookie.value)
    : (await fetchFdalabelCountv2()).data ?? 0;
  const userCount = hasUserCountCookie
    ? Number(userCountCookie.value)
    : (await fetchUserCountv2()).data ?? 0;

  return (
    <LocalGenericProvider
      initialData={{
        hasFdalabelCountCookie,
        fdalabelCount,
        hasUserCountCookie,
        userCount,
      }}
    >
      <Component />
    </LocalGenericProvider>
  );
}
