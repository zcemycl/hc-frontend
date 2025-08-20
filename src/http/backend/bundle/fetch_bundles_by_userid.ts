"use server";
import { ApiResult, IBundle } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

interface BundlesResult extends ApiResult<IBundle[]> {}

export async function fetchBundlesByUserIdv2(
  id: number,
  offset: number = 0,
  limit: number = 5,
): Promise<BundlesResult> {
  const API_URI = `${FASTAPI_URI}/bundles/user/${id}`;
  const token = await get_token_cookie();
  const params = new URLSearchParams();
  params.append("offset", offset.toString());
  params.append("limit", limit.toString());
  const API_URI_PAGINATION = `${API_URI}?${params}`;
  const res = await apiFetch<IBundle[]>(API_URI_PAGINATION, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}
