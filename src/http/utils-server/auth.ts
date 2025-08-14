"use server";
import { UserRoleEnum } from "@/types";
import { dummy_cred } from "@/utils";
import { cookies } from "next/headers";
import { defineCookieAttr } from "./generic";

export async function defineCreds(): Promise<[boolean, string | null]> {
  const cookie = cookies();
  let hasCreds = false,
    creds = null;
  const credsCookie = cookie.get("credentials");
  hasCreds = !!credsCookie && !!credsCookie.value && credsCookie.value != "{}";
  if (process.env.NEXT_PUBLIC_ENV_NAME === "local-dev") {
    console.log("1. Dummy creds for testing without cognito");
    const dummy_username = "leo.leung.rxscope";
    const act = await dummy_cred(dummy_username);
    creds = JSON.stringify({
      AccessToken: act,
      ExpiresIn: 3600,
      IdToken: "",
      RefreshToken: "",
      TokenType: "Bearer",
    });
    hasCreds = true;
  } else {
    creds = hasCreds ? credsCookie!.value : null;
  }
  return [hasCreds, creds];
}

export async function setupAuthHook(): Promise<
  [
    boolean,
    string | null,
    boolean,
    string | null,
    boolean,
    UserRoleEnum | null,
    boolean,
    number | null,
  ]
> {
  const [hasCreds, creds] = await defineCreds();
  const [hasUsername, username] = await defineCookieAttr<string>("username");
  const [hasRole, role] = await defineCookieAttr<UserRoleEnum>(
    "role",
    (raw: string) => {
      return raw as UserRoleEnum;
    },
  );
  const [hasUserId, userId] = await defineCookieAttr<number>("userId", (x) =>
    Number(x),
  );
  return [
    hasCreds,
    creds,
    hasUsername,
    username,
    hasRole,
    role,
    hasUserId,
    userId,
  ];
}
