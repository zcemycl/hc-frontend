"use server";
import { FASTAPI_URI } from "./constants";

export async function fetchHistoryByUserId(id: number, token: string) {
  const API_URI = `${FASTAPI_URI}/history/${id}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await response.json();
  return res;
}

export async function addHistoryByUserId(
  id: number,
  category: string,
  detail: any,
  token: string,
) {
  const API_URI = `${FASTAPI_URI}/history/${id}`;
  console.log(category);
  console.log(detail);
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
  return {};
}

export async function fetchHistoryById(id: number, token: string) {
  const API_URI = `${FASTAPI_URI}/history/history_id/${id}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await response.json();
  return res;
}
