"use server";

import { IBundleUpdate, EmptyResult, IFdaVersions } from "@/types";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";

export async function patchBundleByIdv2(
  id: string,
  bundle_update: IBundleUpdate,
  versions: IFdaVersions,
): Promise<EmptyResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/bundles/${id}`;

  return apiFetch<{}>(API_URI, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bundle_update, versions }),
  });
}
