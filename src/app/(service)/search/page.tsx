"use client";
import { useState, useEffect, useRef } from "react";
import { ProtectedRoute, useAuth } from "@/contexts";
import { redirect, useRouter } from "next/navigation";
import {
  fetchFdalabelByIndication,
  fetchFdalabelByTradename,
  fetchFdalabelBySetid,
  fetchFdalabelCompareAdverseEffects,
} from "@/http/backend";
import {
  PaginationBar,
  TypographyH2,
  Table,
  FdaLabel,
  SearchBar,
} from "@/components";
import { IFdaLabel, ICompareAETable } from "@/types";
import { SortByEnum, SearchQueryTypeEnum } from "./types";
import { QueryTypeDropdown } from "./QueryTypeDropdown";
import { SortByDropdown } from "./SortByDropdown";

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState<string[]>([""]);
  const [queryType, setQueryType] = useState<SearchQueryTypeEnum>(
    SearchQueryTypeEnum.INDICATION,
  );
  const [displayData, setDisplayData] = useState<IFdaLabel[]>([]);
  const [displayDataIndex, setDisplayDataIndex] = useState<number | null>(null);
  const { setIsAuthenticated, credentials } = useAuth();
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

  async function search_query_by_type() {
    const credJson = JSON.parse(credentials);
    let resp;
    if (queryType === SearchQueryTypeEnum.SETID) {
      resp = await fetchFdalabelBySetid(
        query,
        credJson.AccessToken,
        topN,
        pageN * nPerPage,
        undefined,
      );
      setDisplayData(resp);
    } else if (queryType === SearchQueryTypeEnum.TRADENAME) {
      resp = await fetchFdalabelByTradename(
        query,
        credJson.AccessToken,
        topN,
        pageN * nPerPage,
        undefined,
      );
      setDisplayData(resp);
    } else if (queryType === SearchQueryTypeEnum.INDICATION) {
      resp = await fetchFdalabelByIndication(
        query[0],
        credJson.AccessToken,
        topN,
        pageN * nPerPage,
        undefined,
        sortBy,
      );
      setDisplayData(resp);
    }
    return resp;
  }

  // refresh drug list when page is changed
  useEffect(() => {
    async function pageCallback(pageN: number) {
      setDisplayDataIndex(null);
      setCompareTable({ table: [] });
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        router.push("/logout");
      }
      const resp = await search_query_by_type();
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

  return (
    <ProtectedRoute>
      <section
        className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh] overflow-y-scroll"
        ref={refSearchResGroup}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
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
                  setPageN(0);
                  setDisplayDataIndex(null);
                  setSetIdsToCompare(new Set());
                  setCompareTable({ table: [] });
                  if (credentials.length === 0) {
                    setIsAuthenticated(false);
                    redirect("/logout");
                  }
                  const resp = await search_query_by_type();
                  console.log(resp);
                  if (resp.detail?.error! === "AUTH_EXPIRED") {
                    setIsAuthenticated(false);
                    redirect("/logout");
                  }
                }}
                className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg w-full"
              >
                Submit
              </button>
              <div className={`flex flex-row space-x-1`}>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    console.log(setIdsToCompare);
                    let res, resp;
                    if (credentials.length === 0) {
                      setIsAuthenticated(false);
                      redirect("/logout");
                    }
                    const credJson = JSON.parse(credentials);
                    resp = await fetchFdalabelCompareAdverseEffects(
                      Array.from(setIdsToCompare),
                      credJson.AccessToken,
                    );
                    setCompareTable(resp);
                    console.log(resp);
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
              {displayData.map((each, idx) => {
                return (
                  <div
                    className="sm:w-1/2 flex flex-col w-screen p-10"
                    key={each.setid}
                  >
                    <div className="flex justify-between">
                      <TypographyH2>{each.tradename}</TypographyH2>
                      <input
                        type="checkbox"
                        checked={setIdsToCompare.has(each.setid as string)}
                        onClick={(e) => {
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
                        }}
                        readOnly={true}
                      />
                    </div>
                    {queryType !== SearchQueryTypeEnum.INDICATION && (
                      <TypographyH2>{each.setid}</TypographyH2>
                    )}
                    <TypographyH2>
                      Initial US Approval Year: {each.initial_us_approval_year}
                    </TypographyH2>
                    {each.distance && (
                      <TypographyH2>
                        Indication Proximity: {each.distance.toFixed(3)}
                      </TypographyH2>
                    )}
                    <p>{each.indication}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDisplayDataIndex(idx);
                      }}
                    >
                      View more...
                    </button>
                    <hr />
                  </div>
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
