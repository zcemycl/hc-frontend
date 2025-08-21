"use server";

import { EmptyResult } from "@/types";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";

export async function deleteBundleByIdv2(id: string): Promise<EmptyResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/bundles/${id}`;

  return apiFetch<{}>(API_URI, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
