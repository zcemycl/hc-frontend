"use server";
import { FASTAPI_URI } from "./constants";
import { get_token_cookie, validate_response_ok } from "../utils-server";
import { AETableVerEnum, DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { IFdaVersions } from "@/types";

export async function fetchFdalabelBySetid(
  setid: string[],
  maxn: number = 30,
  offset: number = 0,
  limit: number | null = 10,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/search_by_id`;
  let setids_param = setid.join("&id=");
  const params = new URLSearchParams();
  params.append("maxn", maxn.toString());
  params.append("offset", offset.toString());
  // params.append("version", version);
  if (limit !== null) {
    params.append("limit", limit!.toString());
  }

  let API_URI_PAGINATION = `${API_URI}?id=${setids_param}&${params}`;
  const response = await fetch(API_URI_PAGINATION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      versions: versions,
    }),
    cache: "force-cache",
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchFdalabelByTradename(
  tradename: string[],
  maxn: number = 30,
  offset: number = 0,
  limit: number | null = 10,
  // version: AETableVerEnum = AETableVerEnum.v0_0_1,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
) {
  const token = get_token_cookie();
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

  const response = await fetch(API_URI_PAGINATION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      versions: versions,
    }),
    cache: "force-cache",
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchFdalabelByTherapeuticArea(
  ta_description: string,
  maxn: number = 30,
  offset: number = 0,
  limit: number = 10,
  sort_by: string = "relevance",
  version: AETableVerEnum = AETableVerEnum.v0_0_1,
) {
  const token = get_token_cookie();
  const params = new URLSearchParams();
  params.append("maxn", maxn.toString());
  params.append("offset", offset.toString());
  params.append("sort_by", sort_by);
  params.append("version", version);
  if (limit !== null) {
    params.append("limit", limit!.toString());
  }
  const API_URI = `${FASTAPI_URI}/fdalabels/search_by_therapeutic_area`;
  const response = await fetch(
    `${API_URI}?ta_description=${ta_description}&${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
    },
  );
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchFdalabelByIndication(
  indication: string,
  maxn: number = 30,
  offset: number = 0,
  limit: number = 10,
  sort_by: string = "relevance",
  // version: AETableVerEnum = AETableVerEnum.v0_0_1,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
) {
  const token = get_token_cookie();
  const params = new URLSearchParams();
  params.append("maxn", maxn.toString());
  params.append("offset", offset.toString());
  params.append("sort_by", sort_by);
  // params.append("version", version);
  if (limit !== null) {
    params.append("limit", limit!.toString());
  }
  const API_URI = `${FASTAPI_URI}/fdalabels/search_by_indication`;
  const response = await fetch(
    `${API_URI}?indication=${indication}&${params}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        versions: versions,
      }),
      cache: "force-cache",
    },
  );
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchFdalabelHistoryBySetid(
  setid: string,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/history`;
  const response = await fetch(`${API_URI}/${setid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      versions: versions,
    }),
    cache: "force-cache",
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchFdalabelCompareAdverseEffects(setids: string[]) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/compare/adverse-effects`;
  const response = await fetch(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      setids: setids,
    }),
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}
