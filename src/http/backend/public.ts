"use server";
import { FASTAPI_URI } from "./constants";

export async function fetchFdalabelCount(): Promise<number> {
  const API_URI = `${FASTAPI_URI}/get_fdalabel_count`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();
  return res;
}

export async function fetchUserCount(): Promise<number> {
  const API_URI = `${FASTAPI_URI}/get_user_count`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
    next: {
      revalidate: 600,
    },
  });
  const res = await response.json();
  return res;
}
