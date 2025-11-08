"use server";
import { BundleCountResult, IBundle } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { BundleConnectEnum } from "@/constants";

export async function fetchBundlesCountByUserIdv2(
  id: number,
  only_with: BundleConnectEnum | null = null,
): Promise<BundleCountResult> {
  const API_URI = `${FASTAPI_URI}/bundles/get_count/${id}`;
  const token = await get_token_cookie();
  const params = new URLSearchParams();
  if (only_with !== null) {
    params.append("only_with", only_with as BundleConnectEnum);
  }
  const res = await apiFetch<number>(`${API_URI}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}
