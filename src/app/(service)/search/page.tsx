"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  AEVersionContext,
  FdaVersionsProvider,
  SearchSupportContext,
  useAuth,
  useLoader,
} from "@/contexts";
import { useRouter } from "next/navigation";
import { Spinner, ProtectedRoute } from "@/components";
import { IFdaLabel, ICompareAETable, IFdaVersions } from "@/types";
import {
  SortByEnum,
  SearchQueryTypeEnum,
  AETableVerEnum,
  AETableTypeEnum,
  DEFAULT_FDALABEL_VERSIONS,
} from "@/constants";
import { FdalabelFetchService } from "@/services";
import { useHistoryToSearch } from "@/hooks";
import { useBundleToSearch } from "@/hooks/useBundleToSearch";
import ExpandSearchResultItem from "./expand-search-result-item";
import SearchResultsList from "./search-results-list";
import ComplexSearchBar from "./complex-search-bar";
import CompareTables from "./compare-tables";
import VerToolbar from "./ver-toolbar";

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState<string[]>([""]);
  const [queryType, setQueryType] = useState<SearchQueryTypeEnum>(
    SearchQueryTypeEnum.INDICATION,
  );
  const [displayData, setDisplayData] = useState<IFdaLabel[]>([]);
  const [displayDataIndex, setDisplayDataIndex] = useState<number | null>(null);
  const { setIsAuthenticated, credentials, userId, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const [setIdsToCompare, setSetIdsToCompare] = useState<Set<string>>(
    new Set(),
  );
  const [openCollapseCompSection, setOpenCollapseCompSection] =
    useState<AETableTypeEnum>(AETableTypeEnum.empty);
  const [sortBy, setSortBy] = useState<SortByEnum>(SortByEnum.RELEVANCE);
  const [compareTable, setCompareTable] = useState<ICompareAETable>({
    table: [],
  });
  const [topN, setTopN] = useState(30);
  const [pageN, setPageN] = useState(0);
  const [nPerPage, _] = useState(10);
  const [aeVersion, setAeVersion] = useState(AETableVerEnum.v0_0_1);
  const refSearchResGroup = useRef(null);
  const fdaservice = useMemo(
    () =>
      new FdalabelFetchService(
        userId as number,
        topN,
        setIsAuthenticated,
        router,
      ),
    [],
  );
  useHistoryToSearch({ setQueryType, setQuery });
  useBundleToSearch({ setQueryType, setQuery });

  async function search_query_by_type(
    query: string[],
    queryType: SearchQueryTypeEnum,
    version: AETableVerEnum,
  ) {
    let resp;
    if (queryType === SearchQueryTypeEnum.SETID) {
      resp = await fdaservice.handleFdalabelBySetid(
        query,
        DEFAULT_FDALABEL_VERSIONS as IFdaVersions,
      );
    } else if (queryType === SearchQueryTypeEnum.TRADENAME) {
      resp = await fdaservice.handleFdalabelByTradename(
        query,
        DEFAULT_FDALABEL_VERSIONS as IFdaVersions,
      );
    } else if (queryType === SearchQueryTypeEnum.INDICATION) {
      resp = await fdaservice.handleFdalabelByIndication(
        query,
        pageN,
        nPerPage,
        sortBy,
        DEFAULT_FDALABEL_VERSIONS as IFdaVersions,
      );
    } else if (queryType === SearchQueryTypeEnum.TA) {
      resp = await fdaservice.handleFdalabelByTherapeuticArea(
        query,
        pageN,
        nPerPage,
        sortBy,
        DEFAULT_FDALABEL_VERSIONS as IFdaVersions,
      );
    }
    setDisplayData(resp);
    return resp;
  }

  useEffect(() => {
    console.log(displayData);
  }, [displayData]);

  // refresh drug list when page is changed
  useEffect(() => {
    async function pageCallback(pageN: number) {
      setDisplayDataIndex(null);
      setCompareTable({ table: [] });
      console.log("ae table useeffect");
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        router.push("/logout");
      }
      const resp = await search_query_by_type(query, queryType, aeVersion);
      console.log(resp);
    }
    if (query[0] !== "") {
      pageCallback(pageN);
      (refSearchResGroup.current as any).scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageN]);

  // when ae version is changed
  useEffect(() => {
    async function pageCallback(pageN: number) {
      console.log("ae table useeffect");
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        router.push("/logout");
      }
      const resp = await search_query_by_type(query, queryType, aeVersion);
      console.log(resp);
    }
    if (query[0] !== "") {
      pageCallback(pageN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aeVersion]);

  return (
    <ProtectedRoute>
      <FdaVersionsProvider>
        <SearchSupportContext.Provider
          value={{
            displayData,
            displayDataIndex,
            setDisplayDataIndex,
            queryType,
            pageN,
            nPerPage,
            setSetIdsToCompare,
            topN,
            setPageN,
            setIdsToCompare,
            query,
            setQuery,
            setTopN,
            setIsLoading,
            sortBy,
            setSortBy,
            setQueryType,
            setDisplayData,
            compareTable,
            setCompareTable,
            openCollapseCompSection,
            setOpenCollapseCompSection,
          }}
        >
          <AEVersionContext.Provider
            value={{ version: aeVersion, setVersion: setAeVersion }}
          >
            <section
              className={`text-gray-400 bg-gray-900 body-font 
          h-[81vh] sm:h-[89vh] overflow-y-auto
          overflow-x-hidden
          ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
              ref={refSearchResGroup}
            >
              {/* <div className="container px-2 py-24 mx-auto grid justify-items-center"> */}
              <div
                className="flex flex-col px-10 sm:px-5 py-24
            items-center align-middle"
              >
                {(isLoading || isLoadingAuth) && (
                  <div
                    role="status"
                    className="absolute left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2"
                  >
                    <Spinner />
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                <ComplexSearchBar />
                <VerToolbar />
                <CompareTables />

                <ExpandSearchResultItem />
                <SearchResultsList />
              </div>
            </section>
          </AEVersionContext.Provider>
        </SearchSupportContext.Provider>
      </FdaVersionsProvider>
    </ProtectedRoute>
  );
}
