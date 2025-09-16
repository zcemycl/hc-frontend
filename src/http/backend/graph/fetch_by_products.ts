"use server";
import { cookies } from "next/headers";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";
import { ITa2PGraph, GraphResult } from "@/types";

export async function fetchGraphByProductsv2(
  tradename: string[],
  max_level: number = 5,
): Promise<GraphResult> {
  const cookie = cookies();
  const versions = JSON.parse(cookie.get("fda-scrape-cur-version")!.value);
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/graph/get_products_tas_ids`;
  let tradenames_param = tradename.join("&tradename=");
  const params = new URLSearchParams();
  params.append("max_level", max_level.toString());
  const API_URI_COMPLETE = `${API_URI}?tradename=${tradenames_param}&${params}`;
  return apiFetch<ITa2PGraph>(API_URI_COMPLETE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
}
