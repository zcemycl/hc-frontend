"use server";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { IFdaSecAvailVers, FdaSecAvailVersResult } from "@/types";

export async function fetchFdalabelSectionVersionsv2(
  fdaVersion: string = "v0.0.0",
): Promise<FdaSecAvailVersResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/get_section_scrape_version?version=${fdaVersion}`;

  return apiFetch<IFdaSecAvailVers>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
