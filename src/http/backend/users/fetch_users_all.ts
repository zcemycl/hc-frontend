"use server";
import { IUser, UsersRes } from "@/types";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";

export async function fetchUserAllv2(offset = 0, limit = 0): Promise<UsersRes> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/users/?offset=${offset}&limit=${limit}`;

  return apiFetch<IUser[]>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
