"use client";
import { useState, useRef, useMemo } from "react";
import {
  FdaVersionsContext,
  FdaVersionsProvider,
  SearchSupportContext,
  useAuth,
  useLoader,
} from "@/contexts";
import { useRouter } from "next/navigation";
import { Spinner, ProtectedRoute, VerToolbar } from "@/components";
import { IFdaLabel, ICompareAETable, IFdaVersions } from "@/types";
import {
  SortByEnum,
  SearchQueryTypeEnum,
  AETableTypeEnum,
  DEFAULT_FDALABEL_VERSIONS,
} from "@/constants";
import { FdalabelFetchService } from "@/services";
import { useHistoryToSearch, useBundleToSearch } from "@/hooks";
import ExpandSearchResultItem from "./expand-search-result-item";
import SearchResultsList from "./search-results-list";
import ComplexSearchBar from "./complex-search-bar";
import CompareTables from "./compare-tables";

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState<string[]>([""]);
  const [queryType, setQueryType] = useState<SearchQueryTypeEnum>(
    SearchQueryTypeEnum.INDICATION,
  );
  const [displayData, setDisplayData] = useState<IFdaLabel[]>([]);
  const [displayDataIndex, setDisplayDataIndex] = useState<number | null>(null);
  const { setIsAuthenticated, userId, isLoadingAuth } = useAuth();
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
    fdaservice: FdalabelFetchService,
    query: string[],
    queryType: SearchQueryTypeEnum,
    pageN: number,
    nPerPage: number,
    sortBy: SortByEnum,
    versions: IFdaVersions,
  ) {
    let resp;
    if (queryType === SearchQueryTypeEnum.SETID) {
      resp = await fdaservice.handleFdalabelBySetid(query, versions);
    } else if (queryType === SearchQueryTypeEnum.TRADENAME) {
      resp = await fdaservice.handleFdalabelByTradename(query, versions);
    } else if (queryType === SearchQueryTypeEnum.INDICATION) {
      resp = await fdaservice.handleFdalabelByIndication(
        query,
        pageN,
        nPerPage,
        sortBy,
        versions,
      );
    } else if (queryType === SearchQueryTypeEnum.TA) {
      resp = await fdaservice.handleFdalabelByTherapeuticArea(
        query,
        pageN,
        nPerPage,
        sortBy,
        versions,
      );
    }
    setDisplayData(resp);
    return resp;
  }

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
            search_query_by_type,
            fdaservice,
            refSearchResGroup,
          }}
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
              <FdaVersionsContext.Consumer>
                {(values) => (
                  <VerToolbar
                    fdaSections={Object.keys(DEFAULT_FDALABEL_VERSIONS)}
                    reloadCallback={async () => {
                      if (query[0] === "") return;
                      const resp = await search_query_by_type(
                        fdaservice,
                        query,
                        queryType,
                        pageN,
                        nPerPage,
                        sortBy,
                        values.versions,
                      );
                      console.log(resp);
                    }}
                  />
                )}
              </FdaVersionsContext.Consumer>

              <CompareTables />

              <ExpandSearchResultItem />
              <SearchResultsList />
            </div>
          </section>
        </SearchSupportContext.Provider>
      </FdaVersionsProvider>
    </ProtectedRoute>
  );
}
