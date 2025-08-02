import { SearchBar, TypographyH2 } from "@/components";
import { DEFAULT_FDALABEL_VERSIONS, SearchQueryTypeEnum } from "@/constants";
import { FdaVersionsContext, SearchSupportContext, useAuth } from "@/contexts";
import { useContext, useMemo } from "react";
import { SortByDropdown } from "./SortByDropdown";
import { QueryTypeDropdown } from "./QueryTypeDropdown";
import { IFdaVersions } from "@/types";
import { FdalabelFetchService } from "@/services";
import { useRouter } from "next/navigation";

export default function ComplexSearchBar() {
  const router = useRouter();
  const { setIsAuthenticated, credentials, userId } = useAuth();
  const { versions } = useContext(FdaVersionsContext);
  const {
    query,
    setQuery,
    queryType,
    setTopN,
    setIsLoading,
    sortBy,
    setSortBy,
    setQueryType,
    setDisplayData,
    topN,
    pageN,
    nPerPage,
    setPageN,
    setDisplayDataIndex,
    setSetIdsToCompare,
    setCompareTable,
    setIdsToCompare,
    search_query_by_type,
  } = useContext(SearchSupportContext);

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

  return (
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
              fdaservice,
              query,
              queryType,
              pageN,
              nPerPage,
              sortBy,
              versions,
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
                DEFAULT_FDALABEL_VERSIONS as IFdaVersions,
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
  );
}
