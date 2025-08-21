"use server";

import { UserRoleEnum, EmptyResult } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function createUserPostgresv2(
  username: string,
  email: string,
  sub: string,
  enabled: boolean,
  role: UserRoleEnum,
): Promise<EmptyResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/users/`;

  return apiFetch<{}>(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      email,
      sub,
      enabled,
      role,
    }),
  });
}
