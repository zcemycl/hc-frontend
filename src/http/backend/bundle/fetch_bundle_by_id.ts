"use server";

import { IBundle, BundleResult } from "@/types";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";

export async function fetchBundleByIdv2(id: string): Promise<BundleResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/bundles/${id}`;

  return apiFetch<IBundle>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
