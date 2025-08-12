import { SiteMode, UserRoleEnum } from "@/types";

export async function setFdalabelCount(count: number) {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/fdalabel_count", {
    method: "POST",
    headers,
    body: JSON.stringify({
      count,
    }),
  });
  return resp;
}

export async function setUserCount(count: number) {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/user_count", {
    method: "POST",
    headers,
    body: JSON.stringify({
      count,
    }),
  });
  return resp;
}

export async function setPreLogin(
  mode: SiteMode,
  email: string,
  cognito_user: string,
) {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/prelogin", {
    method: "POST",
    headers,
    body: JSON.stringify({
      mode,
      email,
      cognito_user,
    }),
  });
  return resp;
}

export async function setPostLogin(
  mode: SiteMode,
  email: string,
  credentials: string,
  expireAt: string,
  userId: string,
  role: UserRoleEnum,
) {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/postlogin", {
    method: "POST",
    headers,
    body: JSON.stringify({
      mode,
      email,
      credentials,
      expireAt,
      userId,
      role,
    }),
  });
  return resp;
}
