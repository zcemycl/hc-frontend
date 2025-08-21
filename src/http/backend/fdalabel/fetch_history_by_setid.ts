"use server";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { IFdaLabelHistory, IFdaVersions, FdalabelHistoryResult } from "@/types";

export async function fetchFdalabelHistoryBySetidv2(
  setid: string,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
): Promise<FdalabelHistoryResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/history/${setid}`;

  return apiFetch<IFdaLabelHistory>(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
    cache: "force-cache",
  });
}
