"use server";
import { validate_response_ok } from "@/http/utils-server";

type TVerifyCredsOutput = {
  username: string;
};

export async function verifyCreds(
  credentials: string,
): Promise<[boolean, TVerifyCredsOutput | null]> {
  const creds = JSON.parse(credentials);
  const token = creds.AccessToken;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const resp = await fetch("/api/private/service/auth", {
    method: "GET",
    headers,
  });
  if (!validate_response_ok(resp)) {
    return [false, null];
  }
  const res = await resp.json();
  return [true, res];
}
