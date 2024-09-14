"use client";
import { useState, useEffect, useRef } from "react";
import { ProtectedRoute, useAuth, useLoader } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchFdalabelByIndication,
  fetchFdalabelByTradename,
  fetchFdalabelBySetid,
  fetchFdalabelCompareAdverseEffects,
  addHistoryByUserId,
  fetchHistoryById,
} from "@/http/backend";
import {
  PaginationBar,
  TypographyH2,
  Table,
  FdaLabel,
  SearchBar,
  FdaLabelShort,
  Spinner,
} from "@/components";
import {
  IFdaLabel,
  ICompareAETable,
  SearchActionEnum,
  UserHistoryCategoryEnum,
  IHistory,
} from "@/types";
import { SortByEnum, SearchQueryTypeEnum } from "./types";
import { QueryTypeDropdown } from "./QueryTypeDropdown";
import { SortByDropdown } from "./SortByDropdown";

export default function Search() {
  const searchParams = useSearchParams();
  const historyId = searchParams.get("historyId");

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
  const [sortBy, setSortBy] = useState<SortByEnum>(SortByEnum.RELEVANCE);
  const [compareTable, setCompareTable] = useState<ICompareAETable>({
    table: [],
  });
  const [topN, setTopN] = useState(30);
  const [pageN, setPageN] = useState(0);
  const [nPerPage, _] = useState(10);
  const refSearchResGroup = useRef(null);

  async function search_query_by_type(
    query: string[],
    queryType: SearchQueryTypeEnum,
  ) {
    const credJson = JSON.parse(credentials);
    let resp;
    if (queryType === SearchQueryTypeEnum.SETID) {
      resp = await fetchFdalabelBySetid(query, topN, 0, -1);
      await addHistoryByUserId(
        userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.SEARCH,
          query,
          additional_settings: {
            queryType,
          },
        },
      );
    } else if (queryType === SearchQueryTypeEnum.TRADENAME) {
      resp = await fetchFdalabelByTradename(query, topN, 0, -1);
      await addHistoryByUserId(
        userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.SEARCH,
          query,
          additional_settings: {
            queryType,
          },
        },
      );
    } else if (queryType === SearchQueryTypeEnum.INDICATION) {
      resp = await fetchFdalabelByIndication(
        query[0],
        topN,
        pageN * nPerPage,
        undefined,
        sortBy,
      );
      await addHistoryByUserId(
        userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.SEARCH,
          query,
          additional_settings: {
            sortBy,
            queryType,
            pageN: `${pageN}`,
            nPerPage: `${nPerPage}`,
          },
        },
      );
    }
    setDisplayData(resp);
    return resp;
  }

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
      const resp = await search_query_by_type(query, queryType);
      console.log(resp);
      if (resp.detail?.error! === "AUTH_EXPIRED") {
        setIsAuthenticated(false);
        router.push("/logout");
      }
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

  // from profile history
  useEffect(() => {
    console.log("profile history useEffect");
    if (historyId === null) return;
    if (credentials.length === 0) {
      setIsAuthenticated(false);
      router.push("/logout");
    }
    if (historyId !== null) {
      const credJson = JSON.parse(credentials);
      fetchHistoryById(parseInt(historyId)).then(async (history) => {
        if (history.category === UserHistoryCategoryEnum.SEARCH) {
          if (history.detail.action === SearchActionEnum.SEARCH) {
            setQueryType(history.detail.additional_settings.queryType);
            setQuery(history.detail.query);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyId]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
          h-[83vh] sm:h-[90vh] overflow-y-scroll ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
        ref={refSearchResGroup}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
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
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10">
            <TypographyH2>Search</TypographyH2>
            <p className="leading-relaxed mb-5">Please enter your query.</p>
            <SearchBar
              query={query}
              setQuery={(s) => setQuery(s)}
              conditionForMultiBars={
                queryType !== SearchQueryTypeEnum.INDICATION
              }
            />
            <div className="py-1 flex justify-end items-center text-base space-x-1">
              {queryType === SearchQueryTypeEnum.INDICATION && (
                <div className="flex justify-start space-x-3">
                  <label htmlFor="">Top N: </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    step="5"
                    value={topN}
                    className="border-2 border-indigo-500 rounded"
                    onChange={(e) => {
                      setTopN(parseInt(e.currentTarget.value));
                    }}
                  />
                </div>
              )}
              <div className="flex flex-row justify-end space-x-1">
                {queryType === SearchQueryTypeEnum.INDICATION && (
                  <SortByDropdown
                    sortBy={sortBy}
                    setSortBy={(q) => setSortBy(q)}
                    additionalResetCallback={() => setDisplayData([])}
                  />
                )}
                <QueryTypeDropdown
                  queryType={queryType}
                  setQueryType={(q) => setQueryType(q)}
                  additionalResetCallback={() => setDisplayData([])}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <button
                data-testid="search-btn"
                onClick={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  setPageN(0);
                  setDisplayDataIndex(null);
                  setSetIdsToCompare(new Set());
                  setCompareTable({ table: [] });
                  if (credentials.length === 0) {
                    setIsAuthenticated(false);
                    router.push("/logout");
                  }
                  const resp = await search_query_by_type(query, queryType);
                  console.log(resp);
                  setIsLoading(false);
                  if (resp.detail?.error! === "AUTH_EXPIRED") {
                    setIsAuthenticated(false);
                    router.push("/logout");
                  }
                }}
                className="text-white bg-indigo-500 border-0 py-2 px-6 
                focus:outline-none hover:bg-indigo-600 rounded text-lg w-full"
              >
                Submit
              </button>
              <div className={`flex flex-row space-x-1`}>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    console.log(setIdsToCompare);
                    let res, resp;
                    if (credentials.length === 0) {
                      setIsAuthenticated(false);
                      router.push("/logout");
                    }
                    const credJson = JSON.parse(credentials);
                    resp = await fetchFdalabelCompareAdverseEffects(
                      Array.from(setIdsToCompare),
                    );
                    setCompareTable(resp);
                    console.log(resp);
                    setIsLoading(false);
                    await addHistoryByUserId(
                      userId as number,
                      UserHistoryCategoryEnum.SEARCH,
                      {
                        action: SearchActionEnum.COMPARE_AE,
                        query: Array.from(setIdsToCompare) as string[],
                        additional_settings: {
                          query,
                          queryType,
                        },
                      },
                    );
                  }}
                  className={`text-black bg-green-600 
                  border-0
                  focus:outline-none hover:bg-green-700 
                  transition-all duration-200 ease-in-out
                  rounded
                  w-3/4
                  ${Array.from(setIdsToCompare).length > 1 ? "h-full py-2 px-6 text-lg" : "h-0 text-[0px]"}`}
                >
                  Compare Adverse Effects
                </button>
                <button
                  className={`
                  bg-red-600 
                  hover:bg-red-700
                  transition-all duration-200 ease-in-out
                  text-white
                  ${Array.from(setIdsToCompare).length > 1 ? "h-full py-2 px-6 w-1/4 text-lg" : "w-0 h-0 text-[0px]"}
                  rounded
                  border-0`}
                  onClick={() => {
                    setCompareTable({ table: [] });
                    setSetIdsToCompare(new Set());
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {compareTable.table?.length !== 0 && (
            <Table {...{ content: compareTable }} />
          )}

          {displayData.length > 0 && displayDataIndex != null && (
            <div className="sm:w-1/2 flex flex-col w-screen">
              <FdaLabel
                each={displayData[displayDataIndex]}
                displayDataIndex={displayDataIndex}
                back_btn_callback={(s) => setDisplayDataIndex(s)}
              />
            </div>
          )}

          {/* list of drugs */}
          {displayData.length > 0 && displayDataIndex === null && (
            <>
              {(queryType === SearchQueryTypeEnum.INDICATION
                ? displayData
                : displayData.slice(pageN * nPerPage, (pageN + 1) * nPerPage)
              ).map((each, idx) => {
                return (
                  <FdaLabelShort
                    key={each.setid}
                    {...{
                      setid: each.setid!,
                      tradename: each.tradename!,
                      showCheckbox: setIdsToCompare.has(each.setid as string),
                      initial_us_approval_year: each.initial_us_approval_year!,
                      distance: each.distance!,
                      indication: each.indication!,
                      ae_tables_count: each.ae_tables_count!,
                      selectMultipleCallback: (e) => {
                        const ischecked = (e.target as HTMLInputElement)
                          .checked;
                        if (ischecked) {
                          setSetIdsToCompare((prev) =>
                            new Set(prev).add(each.setid as string),
                          );
                        } else {
                          setSetIdsToCompare(
                            (prev) =>
                              new Set(
                                Array.from(prev).filter((x) => x != each.setid),
                              ),
                          );
                        }
                      },
                      clickExpandCallback: () => setDisplayDataIndex(idx),
                    }}
                  />
                );
              })}
              <div className="flex justify-center space-x-1">
                <PaginationBar
                  topN={
                    queryType === SearchQueryTypeEnum.INDICATION
                      ? topN
                      : displayData.length
                  }
                  pageN={pageN}
                  nPerPage={nPerPage}
                  setPageN={(i: number) => {
                    setPageN(i);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
