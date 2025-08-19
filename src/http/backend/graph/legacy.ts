"use server";
import { cookies } from "next/headers";
import { get_token_cookie } from "../../utils-server";
import { FASTAPI_URI } from "../constants";
import { ITa2PGraph } from "@/types";

export async function fetchGraphDummy(
  name: string = "Neoplasms",
  limit: number = 50,
  offset: number = 0,
  product: string | null = null,
): Promise<ITa2PGraph> {
  const cookie = cookies();
  const versions = JSON.parse(cookie.get("fda-scrape-cur-version")!.value);
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/graph`;
  const params = new URLSearchParams();
  params.append("name", name);
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());
  if (product != null) {
    params.append("product", product);
  }
  const API_URI_COMPLETE = `${API_URI}/?${params}`;

  const response = await fetch(API_URI_COMPLETE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
  const res = await response.json();
  return res;
}
