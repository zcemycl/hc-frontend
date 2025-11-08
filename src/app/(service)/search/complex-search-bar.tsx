import { SearchBar, TypographyH2 } from "@/components";
import { SearchQueryTypeEnum } from "@/constants";
import {
  FdaVersionsContext,
  SearchSupportContext,
  useAuth,
  useLoader,
} from "@/contexts";
import { useContext, useMemo } from "react";
import { SortByDropdown } from "./SortByDropdown";
import { QueryTypeDropdown } from "./QueryTypeDropdown";
import { FdalabelFetchService } from "@/services";
import { useRouter } from "next/navigation";

export default function ComplexSearchBar() {
  const router = useRouter();
  const { setIsAuthenticated, userId } = useAuth();
  const { versions } = useContext(FdaVersionsContext);
  const {
    query,
    setQuery,
    queryType,
    setTopN,
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
  const { withLoading } = useLoader();

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
            pb-10 px-6 sm:px-10"
    >
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
            setPageN(0);
            setDisplayDataIndex(null);
            setSetIdsToCompare(new Set());
            setCompareTable({ table: [] });
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
          className="text-white bg-indigo-500 border-0 py-2 px-6 
        focus:outline-none hover:bg-indigo-600 rounded text-lg w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
