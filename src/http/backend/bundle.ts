"use server";

import { get_token_cookie, validate_response_ok } from "../utils-server";
import { FASTAPI_URI } from "./constants";

export async function fetchBundlesByUserId(
  id: number,
  offset: number = 0,
  limit: number = 5,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/bundles/user/${id}`;
  const params = new URLSearchParams();
  params.append("offset", offset.toString());
  params.append("limit", limit.toString());
  const API_URI_PAGINATION = `${API_URI}?${params}`;
  const response = await fetch(API_URI_PAGINATION, {
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
