"use server";

import { IBundle, IBundleConfig, IBundleUpdate } from "@/types";
import { get_token_cookie, validate_response_ok } from "../utils-server";
import { FASTAPI_URI } from "./constants";

export async function fetchBundleById(id: string): Promise<IBundle> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/bundles/${id}`;
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

export async function fetchBundlesByUserId(
  id: number,
  offset: number = 0,
  limit: number = 5,
): Promise<IBundle[]> {
  const token = await get_token_cookie();
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
  if (!validate_response_ok(response)) {
    return [];
  }
  const res = await response.json();
  return res;
}

export async function createBundleByUserId(
  id: number,
  new_bundle: IBundleConfig,
) {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/bundles/${id}`;
  console.log(new_bundle);
  const response = await fetch(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(new_bundle),
  });
  validate_response_ok(response);
  return {};
}

export async function deleteBundleById(id: string) {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/bundles/${id}`;
  const response = await fetch(API_URI, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  return {};
}

export async function patchBundleById(
  id: string,
  bundle_update: IBundleUpdate,
) {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/bundles/${id}`;
  console.log(bundle_update);
  const response = await fetch(API_URI, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bundle_update),
  });
  validate_response_ok(response);
  return {};
}
