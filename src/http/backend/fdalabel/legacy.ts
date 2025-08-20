"use server";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie, validate_response_ok } from "../../utils-server";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { ICompareAETable, IFdaLabelHistory, IFdaVersions } from "@/types";

export async function fetchFdalabelHistoryBySetid(
  setid: string,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
): Promise<IFdaLabelHistory> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/history`;
  const response = await fetch(`${API_URI}/${setid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
    cache: "force-cache",
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchFdalabelCompareAdverseEffects(
  setids: string[],
  versions: IFdaVersions,
): Promise<ICompareAETable> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/compare/adverse-effects`;
  const response = await fetch(API_URI, {
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
  validate_response_ok(response);
  const res = await response.json();
  return res;
}
