"use client";

import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import {
  fetchFdalabelScrapeVersions,
  fetchFdalabelSectionVersions,
} from "@/http/backend";
import { IFdaVersions } from "@/types";
import React, { createContext, useMemo, useState, useEffect } from "react";
import { useAuth } from "./auth";

export const FdaVersionsContext = createContext<any>({});

export const FdaVersionsProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [versions, setVersions] = useState<IFdaVersions>(
    DEFAULT_FDALABEL_VERSIONS,
  );
  const [fdaVers, setFdaVers] = useState<string[]>([
    DEFAULT_FDALABEL_VERSIONS.fdalabel,
  ]);
  const [sectionVersions, setSectionVersions] = useState<{
    [key: string]: any;
  }>(
    Object.fromEntries(
      Object.entries(DEFAULT_FDALABEL_VERSIONS).map(([key, value]) => [
        `${key}_available_versions`,
        [value],
      ]),
    ),
  );

  useEffect(() => {
    async function getData() {
      const [_fdaVers, _sectionVers] = await Promise.all([
        fetchFdalabelScrapeVersions(),
        fetchFdalabelSectionVersions(versions.fdalabel),
      ]);
      setFdaVers([..._fdaVers]);
      setSectionVersions({ ..._sectionVers });
    }
    if (!isLoadingAuth && isAuthenticated) getData();
  }, [isLoadingAuth, isAuthenticated]);

  useEffect(() => {
    async function updateSectionVers() {
      const _sectionVers = await fetchFdalabelSectionVersions(
        versions.fdalabel,
      );
      setSectionVersions({ ..._sectionVers });
    }
    updateSectionVers();
  }, [versions]);

  const FdaVersionsProviderValue = useMemo(() => {
    return {
      versions,
      setVersions,
      fdaVers,
      setFdaVers,
      sectionVersions,
      setSectionVersions,
    };
  }, [versions, fdaVers, sectionVersions]);

  return (
    <FdaVersionsContext.Provider value={FdaVersionsProviderValue}>
      {children}
    </FdaVersionsContext.Provider>
  );
};
