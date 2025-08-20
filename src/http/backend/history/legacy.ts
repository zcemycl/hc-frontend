"use server";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie, validate_response_ok } from "../../utils-server";
import { IHistory } from "@/types";

export async function fetchHistoryByUserIdCount(id: number): Promise<number> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/history/${id}/count`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function addHistoryByUserId(
  id: number,
  category: string,
  detail: any,
) {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/history/${id}`;
  const response = await fetch(API_URI, {
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
  validate_response_ok(response);
  return {};
}

export async function fetchHistoryById(id: number): Promise<IHistory> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/history/history_id/${id}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}
