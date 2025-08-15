"use client";

import {
  DEFAULT_FDALABEL_VERSIONS,
  DEFAULT_FDALALBEL_SECTION_AVAILABLE_VERS,
} from "@/constants";
import {
  fetchFdalabelScrapeVersions,
  fetchFdalabelSectionVersions,
} from "@/http/backend";
import { IFdaSecAvailVers, IFdaVersions, IInitialData } from "@/types";
import React, { createContext, useMemo, useState, useEffect } from "react";
import { useAuth } from "./auth";

export const FdaVersionsContext = createContext<any>({});

export const FdaVersionsProvider = ({
  initialData,
  children,
}: {
  initialData: IInitialData;
  children?: React.ReactNode;
}) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const {
    defaultVers,
    defaultFdaScrapeAvailVers,
    defaultFdaSectionScrapeAvailVers,
  } = initialData;
  const [versions, setVersions] = useState<IFdaVersions>(
    defaultVers ?? DEFAULT_FDALABEL_VERSIONS,
  );
  const [fdaVers, setFdaVers] = useState<string[]>(
    defaultFdaScrapeAvailVers ?? [DEFAULT_FDALABEL_VERSIONS.fdalabel],
  );
  const [sectionVersions, setSectionVersions] = useState<IFdaSecAvailVers>(
    defaultFdaSectionScrapeAvailVers ??
      DEFAULT_FDALALBEL_SECTION_AVAILABLE_VERS,
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
    if (!isLoadingAuth && isAuthenticated) updateSectionVers();
  }, [isLoadingAuth, isAuthenticated, versions]);

  // useEffect(() => {

  // }, [versions, ])

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
