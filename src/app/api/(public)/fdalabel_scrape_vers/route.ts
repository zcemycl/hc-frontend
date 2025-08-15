"use server";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payloads = await request.json();
  const defaultVers = payloads["fda-scrape-cur-version"];
  const defaultFdaScrapeAvailVers = payloads["fda-scrape-available-versions"];
  const defaultFdaSectionScrapeAvailVers =
    payloads["fda-section-scrape-available-versions"];
  const response = NextResponse.json(
    { message: "cache set in cookie" },
    { status: 200 },
  );
  response.cookies.set("fda-scrape-cur-version", JSON.stringify(defaultVers));
  response.cookies.set(
    "fda-scrape-available-versions",
    JSON.stringify(defaultFdaScrapeAvailVers),
  );
  response.cookies.set(
    "fda-section-scrape-available-versions",
    JSON.stringify(defaultFdaSectionScrapeAvailVers),
  );
  return response;
}
