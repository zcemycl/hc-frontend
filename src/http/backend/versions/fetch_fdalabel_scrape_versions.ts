"use server";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";
import { FdaScrapeVersRes } from "@/types";

export async function fetchFdalabelScrapeVersionsv2(): Promise<FdaScrapeVersRes> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/fdalabels/get_scrape_version`;
  return apiFetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
