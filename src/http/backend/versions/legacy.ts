"use server";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie, validate_response_ok } from "../../utils-server";
import { IFdaSecAvailVers } from "@/types";

/**
 * @deprecated User `fetchFdalabelScrapeVersionsv2` instead.
 */
export async function fetchFdalabelScrapeVersions(): Promise<string[]> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/get_scrape_version`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchFdalabelSectionVersions(
  fdaVersion: string = "v0.0.0",
): Promise<IFdaSecAvailVers> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/get_section_scrape_version?version=${fdaVersion}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}
