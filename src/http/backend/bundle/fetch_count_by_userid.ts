"use server";
import { BundleCountResult, IBundle } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function fetchBundlesCountByUserIdv2(
  id: number,
): Promise<BundleCountResult> {
  const API_URI = `${FASTAPI_URI}/bundles/get_count/${id}`;
  const token = await get_token_cookie();
  const res = await apiFetch<number>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}
