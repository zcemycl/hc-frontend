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
import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./auth";
import { usePathname } from "next/navigation";
import { setFdaVersAllCookie } from "@/http/internal";
import { useLoader } from "./loader";

export const FdaVersionsContext = createContext<any>({});

export const FdaVersionsProvider = ({
  initialData,
  children,
}: {
  initialData: IInitialData;
  children?: React.ReactNode;
}) => {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const { withLoading } = useLoader();
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
      const [_fdaVers, _sectionVers] = await withLoading(() =>
        Promise.all([
          fetchFdalabelScrapeVersions(),
          fetchFdalabelSectionVersions(versions.fdalabel),
        ]),
      );
      if (!("detail" in _fdaVers)) setFdaVers([..._fdaVers]);
      if (!("detail" in _sectionVers)) setSectionVersions({ ..._sectionVers });
    }
    console.log(isLoadingAuth, isAuthenticated, pathname);
    if (isAuthenticated) getData();
  }, [isAuthenticated]);

  useEffect(() => {
    async function updateSectionVers() {
      const _sectionVers = await withLoading(() =>
        fetchFdalabelSectionVersions(versions.fdalabel),
      );
      if (!("detail" in _sectionVers)) setSectionVersions({ ..._sectionVers });
    }
    if (isAuthenticated) updateSectionVers();
  }, [isAuthenticated, versions]);

  // change page and store options
  useEffect(() => {
    if (pathname !== prevPath.current) {
      setFdaVersAllCookie(versions, fdaVers, sectionVersions);
      prevPath.current = pathname;
    }
  }, [pathname]);

  // store cookie when changing
  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      setFdaVersAllCookie(versions, fdaVers, sectionVersions);
    }
  }, [versions, sectionVersions, isLoadingAuth, isAuthenticated]);

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
