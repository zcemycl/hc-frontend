"use server";

import { EmptyResult } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function deleteUserByIdv2(id: number): Promise<EmptyResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/users/${id}`;

  return apiFetch<{}>(API_URI, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
