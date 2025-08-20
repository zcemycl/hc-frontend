"use server";

import { IUser, UserResult } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function fetchUserInfoByIdv2(id: number): Promise<UserResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/users/id/${id}`;

  return apiFetch<IUser>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
