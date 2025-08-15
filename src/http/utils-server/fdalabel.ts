"use server";
import { defineCookieAttr } from "./generic";
import { IFdaVersions } from "@/types";

type IFdaSecAvailVers = Record<string, string[] | null>;

export async function setupScrapeVersionsHook(): Promise<
  [
    boolean,
    IFdaVersions | null,
    boolean,
    string[] | null,
    boolean,
    IFdaSecAvailVers | null,
  ]
> {
  const [hasDefaultVers, defaultVers] = await defineCookieAttr<IFdaVersions>(
    "fda-scrape-cur-version",
    (raw: string) => JSON.parse(raw),
  );
  const [hasDefaultFdaScrapeAvailVers, defaultFdaScrapeAvailVers] =
    await defineCookieAttr<string[]>(
      "fda-scrape-available-versions",
      (raw: string) => JSON.parse(raw),
    );
  const [
    hasDefaultFdaSectionScrapeAvailVers,
    defaultFdaSectionScrapeAvailVers,
  ] = await defineCookieAttr<IFdaSecAvailVers>(
    "fda-section-scrape-available-versions",
    (raw: string) => JSON.parse(raw),
  );
  return [
    hasDefaultVers,
    defaultVers,
    hasDefaultFdaScrapeAvailVers,
    defaultFdaScrapeAvailVers,
    hasDefaultFdaSectionScrapeAvailVers,
    defaultFdaSectionScrapeAvailVers,
  ];
}
