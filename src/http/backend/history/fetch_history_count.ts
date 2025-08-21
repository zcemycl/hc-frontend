"use server";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { HistoryCountResult } from "@/types";

export async function fetchHistoryByUserIdCountv2(
  id: number,
): Promise<HistoryCountResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/history/${id}/count`;

  return apiFetch<number>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
