import { FdaLabelShort, PaginationBar } from "@/components";
import { SearchQueryTypeEnum } from "@/constants";
import { SearchSupportContext } from "@/contexts";
import { IFdaLabel } from "@/types";
import { useContext } from "react";

export default function SearchResultsList() {
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
  } = useContext(SearchSupportContext);
  return (
    <>
      {displayData.length > 0 && displayDataIndex === null && (
        <div
          className="flex flex-col justify-center
            content-center items-center"
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
    </>
  );
}
