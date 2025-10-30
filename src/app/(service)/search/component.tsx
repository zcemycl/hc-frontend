"use client";
import { useState, useRef, useMemo, useContext, useEffect } from "react";
import {
  FdaVersionsContext,
  SearchSupportContext,
  useAuth,
  useLoader,
} from "@/contexts";
import { useRouter } from "next/navigation";
import {
  ProtectedRoute,
  VerToolbar,
  HandleNotOKResponseModal,
  PulseTemplate,
  CompositeCorner,
} from "@/components";
import { IFdaLabel, ICompareAETable, IFdaVersions } from "@/types";
import {
  SortByEnum,
  SearchQueryTypeEnum,
  AETableTypeEnum,
  DEFAULT_FDALABEL_VERSIONS,
} from "@/constants";
import { FdalabelFetchService } from "@/services";
import { useHistoryToSearch, useBundleToSearch, useApiHandler } from "@/hooks";
import ExpandSearchResultItem from "./expand-search-result-item";
import SearchResultsList from "./search-results-list";
import ComplexSearchBar from "./complex-search-bar";
import CompareTables from "./compare-tables";
import { RefreshCcw } from "lucide-react";

export default function Search() {
  const router = useRouter();
  const { handleResponse } = useApiHandler();
  const [tabName, setTabName] = useState("search");
  const [query, setQuery] = useState<string[]>([""]);
  const [queryType, setQueryType] = useState<SearchQueryTypeEnum>(
    SearchQueryTypeEnum.INDICATION,
  );
  const [displayData, setDisplayData] = useState<IFdaLabel[]>([]);
  const [displayDataIndex, setDisplayDataIndex] = useState<number | null>(null);
  const { setIsAuthenticated, userId } = useAuth();
  const { withLoading } = useLoader();
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
  const refSearchResGroup = useRef<HTMLElement>(null);
  const [prevScroll, setPrevScroll] = useState<number | null>(null);
  const { versions } = useContext(FdaVersionsContext);
  const setIdsToCompareLength = useMemo(() => {
    return Array.from(setIdsToCompare).length;
  }, [setIdsToCompare]);
  const searchPageOpts = useMemo(() => {
    return [
      {
        key: "search",
        displayName: "Search",
        count: null,
        hasResetBtn: true,
      },
      {
        key: "compare",
        displayName: "Compare",
        count: setIdsToCompareLength,
        hasResetBtn: true,
      },
      {
        key: "bundle",
        displayName: "Bundle",
        count: setIdsToCompareLength,
        hasResetBtn: true,
      },
    ];
  }, [setIdsToCompareLength]);
  const fdaservice = useMemo(
    () =>
      new FdalabelFetchService(
        userId as number,
        topN,
        setIsAuthenticated,
        router,
      ),
    [topN],
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
      resp = await withLoading(() =>
        fdaservice.handleFdalabelBySetid(query, versions),
      );
    } else if (queryType === SearchQueryTypeEnum.TRADENAME) {
      resp = await withLoading(() =>
        fdaservice.handleFdalabelByTradename(query, versions),
      );
    } else if (queryType === SearchQueryTypeEnum.INDICATION) {
      resp = await withLoading(() =>
        fdaservice.handleFdalabelByIndication(
          query,
          pageN,
          nPerPage,
          sortBy,
          versions,
        ),
      );
    } else if (queryType === SearchQueryTypeEnum.TA) {
      resp = await withLoading(() =>
        fdaservice.handleFdalabelByTherapeuticArea(
          query,
          pageN,
          nPerPage,
          sortBy,
          versions,
        ),
      );
    }
    handleResponse(resp);
    setDisplayData(resp.data ?? []);
    return resp;
  }

  useEffect(() => {
    const el = refSearchResGroup.current;
    if (displayDataIndex === null) {
      el?.scrollTo({ top: prevScroll as number, behavior: "smooth" });
      setPrevScroll(null);
    } else {
      el?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [displayDataIndex]);

  useEffect(() => {
    if (tabName !== "compare") return;
    if (Array.from(setIdsToCompare).length === 0) return;
    const compareData = async (setIdsToCompare: Set<string>) => {
      const resp = await withLoading(() =>
        fdaservice.handleAETablesComparison(
          setIdsToCompare,
          query,
          queryType,
          versions,
        ),
      );
      if (!resp.success) handleResponse(resp);
      setCompareTable(resp.data ?? { table: [] });
    };
    compareData(setIdsToCompare);
  }, [tabName, setIdsToCompare]);

  return (
    <ProtectedRoute>
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
          prevScroll,
          setPrevScroll,
        }}
      >
        <PulseTemplate refSection={refSearchResGroup} overflowY={true}>
          <div className="overflow-x-hidden">
            <HandleNotOKResponseModal />
            <div
              className="flex flex-col px-10 sm:px-5 py-24
            items-center align-middle"
            >
              {!(displayData.length > 0 && displayDataIndex != null) && (
                <>
                  <div
                    className="flex flex-col
                w-screen sm:w-11/12 md:w-8/12 pt-10 pb-3 px-6 sm:px-10"
                  >
                    <div
                      className="py-1 flex flex-row gap-2 rounded-lg
                  w-fit bg-gray-900"
                    >
                      {searchPageOpts.map((v) => {
                        return (
                          <div
                            key={`tab-${v.key}`}
                            className={`px-2 py-1 text-center text-black
                            rounded-lg flex flex-row gap-1 flex-wrap
                            items-center
                            ${
                              tabName === v.key
                                ? `bg-indigo-500 font-semibold 
                                  shadow-md shadow-indigo-950 text-white`
                                : `bg-slate-500 shadow-md 
                                  shadow-black cursor-pointer hover:text-white`
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              setTabName(v.key);
                            }}
                          >
                            <span>{v.displayName}</span>
                            {v.count !== null && (
                              <span
                                className={`flex items-center justify-center
                                  rounded-md bg-slate-300 text-black
                                  font-semibold w-5 aspect-square
                                  ${v.count > 0 ? "animate-pulse" : ""}`}
                              >
                                {v.count}
                              </span>
                            )}
                            {v.hasResetBtn && (
                              <button
                                className="rounded-full 
                              bg-emerald-300 hover:bg-emerald-500 
                              p-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (v.key === "search") {
                                    setDisplayDataIndex(null);
                                    setDisplayData([]);
                                    setQueryType(
                                      SearchQueryTypeEnum.INDICATION,
                                    );
                                    setQuery([""]);
                                  } else if (
                                    v.key === "compare" ||
                                    v.key === "bundle"
                                  ) {
                                    setSetIdsToCompare(new Set());
                                  }
                                }}
                              >
                                <RefreshCcw className="w-4 h-4 text-black" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {tabName === "search" && (
                    <>
                      <ComplexSearchBar />
                      <div
                        className="flex flex-col
                  w-full sm:w-11/12 md:w-8/12
                  space-y-0 sm:space-y-1
                  px-0 sm:px-10"
                      >
                        <VerToolbar
                          fdaSections={Object.keys(DEFAULT_FDALABEL_VERSIONS)}
                          reloadCallback={async () => {
                            if (query[0] === "") return;
                            const resp = await withLoading(() =>
                              search_query_by_type(
                                fdaservice,
                                query,
                                queryType,
                                pageN,
                                nPerPage,
                                sortBy,
                                versions,
                              ),
                            );
                            console.log(resp);
                          }}
                        />
                      </div>
                    </>
                  )}
                  {tabName === "compare" && (
                    <div className="sm:w-8/12 w-full">
                      <div
                        className="flex flex-col
                          w-full
                          pb-10 px-6 sm:px-10"
                      >
                        {setIdsToCompareLength !== 0 ? (
                          <p
                            className="leading-relaxed mb-5 
                              flex flex-row gap-2 flex-wrap
                              items-center"
                          >
                            <span>
                              Comparing {setIdsToCompareLength} drugs, including{" "}
                            </span>
                            {displayData
                              .filter((d) =>
                                Array.from(setIdsToCompare).includes(
                                  d.setid as string,
                                ),
                              )
                              .map((d) => {
                                return (
                                  <div
                                    key={`compare-${d.setid}`}
                                    className="bg-emerald-400 rounded-lg px-2"
                                  >
                                    <CompositeCorner
                                      {...{
                                        label: d.tradename,
                                        click_callback: () => {},
                                        del_callback: () => {
                                          setSetIdsToCompare(
                                            (prev: Set<string>) =>
                                              new Set(
                                                Array.from(prev).filter(
                                                  (x) => x != d.setid,
                                                ),
                                              ),
                                          );
                                        },
                                      }}
                                    />
                                  </div>
                                );
                              })}
                          </p>
                        ) : (
                          <p className="leading-relaxed mb-5">
                            No drugs to compare, please search and select drugs
                            for comparison.
                          </p>
                        )}

                        <CompareTables />
                      </div>
                    </div>
                  )}
                </>
              )}
              {tabName === "bundle" && <></>}
              {tabName === "search" && (
                <>
                  <ExpandSearchResultItem />
                  <SearchResultsList />
                </>
              )}
            </div>
          </div>
        </PulseTemplate>
      </SearchSupportContext.Provider>
    </ProtectedRoute>
  );
}
