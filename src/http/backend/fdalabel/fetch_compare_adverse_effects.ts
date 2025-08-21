"use server";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { ICompareAETable, IFdaVersions, CompareAETableResult } from "@/types";

export async function fetchFdalabelCompareAdverseEffectsv2(
  setids: string[],
  versions: IFdaVersions,
): Promise<CompareAETableResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/compare/adverse-effects`;

  return apiFetch<ICompareAETable>(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      item: { setids },
      versions,
    }),
  });
}
