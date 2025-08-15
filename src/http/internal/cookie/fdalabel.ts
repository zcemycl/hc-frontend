import { IFdaSecAvailVers, IFdaVersions } from "@/types";

export async function setFdaVersAllCookie(
  fdaVers: IFdaVersions,
  fdaAvailableScrapeVers: string[],
  fdaSecAvailableScrapeVers: IFdaSecAvailVers,
) {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/fdalabel_scrape_vers", {
    method: "POST",
    headers,
    body: JSON.stringify({
      "fda-scrape-cur-version": fdaVers,
      "fda-scrape-available-versions": fdaAvailableScrapeVers,
      "fda-section-scrape-available-versions": fdaSecAvailableScrapeVers,
    }),
  });
  return resp;
}
