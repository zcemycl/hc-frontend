"use server";
import { FdalabelsResult, IFdaLabel, IFdaVersions } from "@/types";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";

export async function fetchFdalabelByTherapeuticAreav2(
  ta_description: string,
  maxn: number = 30,
  offset: number = 0,
  limit: number | null = 10,
  sort_by: string = "relevance",
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
): Promise<FdalabelsResult> {
  const token = await get_token_cookie();
  const params = new URLSearchParams();
  params.append("maxn", maxn.toString());
  params.append("offset", offset.toString());
  params.append("sort_by", sort_by);
  if (limit !== null) {
    params.append("limit", limit.toString());
  }
  const API_URI = `${FASTAPI_URI}/fdalabels/search_by_therapeutic_area`;
  const API_URI_PAGINATION = `${API_URI}?ta_description=${ta_description}&${params}`;

  return apiFetch<IFdaLabel[]>(API_URI_PAGINATION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
}
