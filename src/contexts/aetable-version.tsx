"use client";
import { createContext } from "react";
import { AETableVerEnum } from "@/constants";

interface IAeVersion {
  version?: AETableVerEnum;
  setVersion?: (q: AETableVerEnum) => void;
}

const AEVersionContext = createContext<IAeVersion>({});

export { AEVersionContext, type IAeVersion };
