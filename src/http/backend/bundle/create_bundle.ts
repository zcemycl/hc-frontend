"use server";

import { IBundleConfig, EmptyResult } from "@/types";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";

export async function createBundleByUserIdv2(
  id: number,
  new_bundle: IBundleConfig,
): Promise<EmptyResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/bundles/${id}`;
  console.log(new_bundle);

  return apiFetch<{}>(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(new_bundle),
  });
}
