"use server";
import { FdalabelsResult, IFdaLabel, IFdaVersions } from "@/types";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";

export async function fetchFdalabelByTradenamev2(
  tradename: string[],
  maxn: number = 30,
  offset: number = 0,
  limit: number | null = 10,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
): Promise<FdalabelsResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/search_by_tradename`;
  let tradenames_param = tradename.join("&tradename=");
  const params = new URLSearchParams();
  params.append("maxn", maxn.toString());
  params.append("offset", offset.toString());
  // params.append("version", version);
  if (limit !== null) {
    params.append("limit", limit!.toString());
  }
  let API_URI_PAGINATION = `${API_URI}?tradename=${tradenames_param}&${params}`;

  return apiFetch<IFdaLabel[]>(API_URI_PAGINATION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
}
