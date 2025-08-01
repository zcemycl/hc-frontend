"use client";
import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { AEVersionContext, useAuth, useLoader } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PaginationBar,
  TypographyH2,
  Table,
  FdaLabel,
  SearchBar,
  FdaLabelShort,
  Spinner,
  ProtectedRoute,
} from "@/components";
import { IFdaLabel, ICompareAETable } from "@/types";
import {
  SortByEnum,
  SearchQueryTypeEnum,
  AETableVerEnum,
  tabletype_compare_caption,
  AETableTypeEnum,
} from "@/constants";
import { QueryTypeDropdown } from "./QueryTypeDropdown";
import { SortByDropdown } from "./SortByDropdown";
import { FdalabelFetchService } from "@/services";
import { useHistoryToSearch } from "@/hooks";
import { useBundleToSearch } from "@/hooks/useBundleToSearch";

export default function Search() {
  const searchParams = useSearchParams();
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
      resp = await fdaservice.handleFdalabelBySetid(query, version);
    } else if (queryType === SearchQueryTypeEnum.TRADENAME) {
      resp = await fdaservice.handleFdalabelByTradename(query, version);
    } else if (queryType === SearchQueryTypeEnum.INDICATION) {
      resp = await fdaservice.handleFdalabelByIndication(
        query,
        pageN,
        nPerPage,
        sortBy,
        version,
      );
    } else if (queryType === SearchQueryTypeEnum.TA) {
      resp = await fdaservice.handleFdalabelByTherapeuticArea(
        query,
        pageN,
        nPerPage,
        sortBy,
        version,
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
            <div
              className="flex flex-col
              w-screen sm:w-11/12 md:w-8/12
              py-10 px-6 sm:px-10"
            >
              <TypographyH2>Search</TypographyH2>
              <p className="leading-relaxed mb-5">Please enter your query.</p>
              <SearchBar
                query={query}
                setQuery={(s) => setQuery(s)}
                conditionForMultiBars={
                  queryType !== SearchQueryTypeEnum.INDICATION &&
                  queryType !== SearchQueryTypeEnum.TA
                }
              />
              <div
                className="py-1 flex justify-end
                flex-col sm:flex-row
                space-y-2 sm:space-y-0
                space-x-0 sm:space-x-1
                sm:items-center
                 text-base"
              >
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
                        const val = parseInt(e.currentTarget.value);
                        fdaservice.topN = val;
                        setTopN(val);
                      }}
                    />
                  </div>
                )}
                <div
                  className="flex 
                  flex-col sm:flex-row
                  space-y-2 sm:space-y-0
                  space-x-0 sm:space-x-2
                  justify-end"
                >
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
                    const resp = await search_query_by_type(
                      query,
                      queryType,
                      aeVersion,
                    );
                    console.log(resp);
                    setIsLoading(false);
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
                      if (credentials.length === 0) {
                        setIsAuthenticated(false);
                        router.push("/logout");
                      }
                      const resp = await fdaservice.handleAETablesComparison(
                        setIdsToCompare,
                        query,
                        queryType,
                      );
                      setCompareTable(resp);
                      console.log(resp);
                      setIsLoading(false);
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
            <div
              className="sm:w-8/12 w-full overflow-x-auto 
              flex flex-col space-y-2"
            >
              {Object.keys(compareTable).map((tabletype) => {
                if (compareTable[tabletype].length === 0)
                  return <Fragment key={`${tabletype}-comp`}></Fragment>;
                return (
                  <div
                    className="justify-start flex flex-col"
                    key={`${tabletype}-comp`}
                  >
                    <button
                      className="p-2 bg-sky-300 hover:bg-sky-700 rounded-lg text-black"
                      onClick={() => {
                        if (openCollapseCompSection === tabletype) {
                          setOpenCollapseCompSection("" as AETableTypeEnum);
                          return;
                        }
                        setOpenCollapseCompSection(
                          tabletype as AETableTypeEnum,
                        );
                      }}
                    >
                      {tabletype_compare_caption[tabletype as AETableTypeEnum]}
                    </button>
                    <div
                      className={`
                        ${openCollapseCompSection === tabletype ? "" : "hidden"}
                      `}
                    >
                      <Table
                        {...{ content: compareTable, keyname: tabletype }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

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
              <div
                className="flex flex-col justify-center
                content-center items-center"
              >
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
                        initial_us_approval_year:
                          each.initial_us_approval_year!,
                        distance: each.distance!,
                        indication: each.indication!,
                        therapeutic_areas: each.therapeutic_areas!,
                        ae_tables_count: each.ae_tables_count!,
                        ct_tables_count: each.ct_tables_count!,
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
                                  Array.from(prev).filter(
                                    (x) => x != each.setid,
                                  ),
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
              </div>
            )}
          </div>
        </section>
      </AEVersionContext.Provider>
    </ProtectedRoute>
  );
}
