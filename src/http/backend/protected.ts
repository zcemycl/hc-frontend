"use server";
import { FASTAPI_URI } from "./constants";
import { get_token_cookie, validate_response_ok } from "../utils-server";

export async function fetchFdalabelBySetid(
  setid: string[],
  maxn: number = 30,
  offset: number = 0,
  limit: number | null = 10,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/search_by_id`;
  let setids_param = setid.join("&id=");
  let API_URI_PAGINATION = `${API_URI}?id=${setids_param}&maxn=${maxn}&offset=${offset}&limit=${limit}`;
  const response = await fetch(API_URI_PAGINATION, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/search_by_tradename`;
  let tradenames_param = tradename.join("&tradename=");
  let API_URI_PAGINATION = `${API_URI}?tradename=${tradenames_param}&maxn=${maxn}&offset=${offset}&limit=${limit}`;
  const response = await fetch(API_URI_PAGINATION, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "force-cache",
  });
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
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/search_by_indication`;
  const response = await fetch(
    `${API_URI}?indication=${indication}&maxn=${maxn}&offset=${offset}&limit=${limit}&sort_by=${sort_by}`,
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

export async function fetchFdalabelHistoryBySetid(setid: string) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/history`;
  const response = await fetch(`${API_URI}/${setid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
