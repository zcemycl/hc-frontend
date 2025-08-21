"use server";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { IHistory, HistoryResult } from "@/types";

export async function fetchHistoryByIdv2(id: number): Promise<HistoryResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/history/history_id/${id}`;

  return apiFetch<IHistory>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
