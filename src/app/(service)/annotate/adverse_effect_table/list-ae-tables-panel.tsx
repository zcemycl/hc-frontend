import { ExpandableBtn, PaginationBar2, Table } from "@/components";
import { useAETableAnnotation } from "@/contexts";
import { GoIcon } from "@/icons";
import { Fragment } from "react";
import { transformData } from "@/utils";
import { IBaseTable } from "@/types";
import { useRouter } from "next/navigation";

export default function ListAETablesPanel() {
  const router = useRouter();
  const {
    tableData,
    tabName,
    saveAETableAnnotationPageCache,
    topN,
    nPerPage,
    saveTabPage,
    pageN,
  } = useAETableAnnotation();
  return (
    <Fragment>
      <div className="sm:w-1/2 flex flex-col w-full px-1 pt-5 pb-5 space-y-2">
        {Object.keys(transformData(tableData)).map((keyName, kid) => {
          return (
            <div
              key={keyName}
              className="w-full overflow-x-hidden
                flex flex-col justify-center"
            >
              <h1 key={keyName}>{keyName}</h1>
              {transformData(tableData)[keyName].map((data, idx) => {
                return (
                  <ExpandableBtn
                    key={`${data.fdalabel.setid}-${data.idx}`}
                    refkey={`${data.fdalabel.setid}-${data.idx}`}
                    childrenLong={
                      <>
                        {data.fdalabel.indication
                          ?.split(" ")
                          .splice(0, 20)
                          .join(" ")}{" "}
                        ...
                        <Table
                          {...{
                            content: {
                              table:
                                data.adverse_effect_table!.content.table.slice(
                                  0,
                                  6,
                                ),
                            } as IBaseTable,
                            keyname: "table",
                            hasCopyBtn: false,
                          }}
                        />
                      </>
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      const params = new URLSearchParams();
                      params.append("tab", tabName);
                      let redirectUrl = `/annotate/fdalabel/${data.fdalabel.setid}/adverse_effect_table/${data.idx}`;
                      redirectUrl = `${redirectUrl}?${params}`;
                      router.push(redirectUrl);
                    }}
                  >
                    <>
                      <p className="leading-relaxed w-full">
                        {data.fdalabel.tradename} [Table {data.idx}]
                      </p>
                      <div
                        className={`transition-all duration-300
                              overflow-hidden
                              max-w-0
                              group-hover:max-w-full
                            `}
                      >
                        <GoIcon />
                      </div>
                    </>
                  </ExpandableBtn>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center space-x-1 flex-wrap">
        <PaginationBar2
          topN={topN}
          pageN={pageN}
          nPerPage={nPerPage}
          setPageN={(i: number) => {
            // setPageN(i);
            saveAETableAnnotationPageCache(tabName, i);
            saveTabPage(i);
          }}
        />
      </div>
    </Fragment>
  );
}
