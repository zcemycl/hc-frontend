"use server";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { EmptyResult } from "@/types";

export async function addHistoryByUserIdv2(
  id: number,
  category: string,
  detail: any,
): Promise<EmptyResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/history/${id}`;

  return apiFetch<{}>(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      category,
      detail,
    }),
  });
}
