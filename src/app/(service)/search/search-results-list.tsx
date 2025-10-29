import { FdaLabelShort, PaginationBar, PaginationBar2 } from "@/components";
import { SearchQueryTypeEnum } from "@/constants";
import { FdaVersionsContext, SearchSupportContext, useAuth } from "@/contexts";
import { useApiHandler } from "@/hooks";
import { IFdaLabel } from "@/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function SearchResultsList() {
  const router = useRouter();
  const { setIsAuthenticated, credentials } = useAuth();
  const { handleResponse } = useApiHandler();
  const {
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
    setCompareTable,
    search_query_by_type,
    fdaservice,
    query,
    sortBy,
    refSearchResGroup,
  } = useContext(SearchSupportContext);
  const { versions } = useContext(FdaVersionsContext);

  useEffect(() => {
    async function pageCallback(pageN: number) {
      setDisplayDataIndex(null);
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
      handleResponse(resp);
      console.log(resp);
    }
    if (query[0] !== "") {
      pageCallback(pageN);
      if (refSearchResGroup.current) {
        (refSearchResGroup.current as any).scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageN]);

  return (
    <>
      {displayData.length > 0 && displayDataIndex === null && (
        <div
          className="flex flex-col justify-center
            content-center items-center space-y-1"
        >
          {(queryType === SearchQueryTypeEnum.INDICATION
            ? displayData
            : displayData.slice(pageN * nPerPage, (pageN + 1) * nPerPage)
          ).map((each: IFdaLabel, idx: number) => {
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
                  therapeutic_areas: each.therapeutic_areas!,
                  ae_tables_count: each.ae_tables_count!,
                  ct_tables_count: each.ct_tables_count!,
                  selectMultipleCallback: (e) => {
                    const ischecked = (e.target as HTMLInputElement).checked;
                    if (ischecked) {
                      setSetIdsToCompare((prev: string[]) =>
                        new Set(prev).add(each.setid as string),
                      );
                    } else {
                      setSetIdsToCompare(
                        (prev: string[]) =>
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
            <PaginationBar2
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
    </>
  );
}
