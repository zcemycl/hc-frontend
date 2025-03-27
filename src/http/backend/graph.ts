"use server";
import { get_token_cookie } from "../utils-server";
import { FASTAPI_URI } from "./constants";

export async function fetchGraphDummy(
  name: string = "Neoplasms",
  limit: number = 50,
  offset: number = 0,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/graph`;
  const params = new URLSearchParams();
  params.append("name", name);
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());
  const API_URI_COMPLETE = `${API_URI}/?${params}`;

  const response = await fetch(API_URI_COMPLETE, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await response.json();
  return res;
}
