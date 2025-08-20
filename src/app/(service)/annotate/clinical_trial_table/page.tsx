"use client";

import {
  Spinner,
  TypographyH2,
  Table,
  ExpandableBtn,
  PaginationBar,
  ProtectedRoute,
  BackBtn,
} from "@/components";
import { AnnotationTypeEnum } from "@/constants";
import { useAuth, useLoader } from "@/contexts";
import {
  fetchUnannotatedAETableByUserIdv2,
  fetchUnannotatedAETableByUserIdCountv2,
} from "@/http/backend";
import { GoIcon } from "@/icons";
import {
  AnnotationCategoryEnum,
  IBaseTable,
  IUnAnnotatedAETable,
} from "@/types";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { transformData } from "@/utils";
import { useApiHandler } from "@/hooks";

export default function Page() {
  const router = useRouter();
  const { userId, credentials, isLoadingAuth } = useAuth();
  const { handleResponse } = useApiHandler();
  const { isLoadingv2, withLoading } = useLoader();
  const refUnannotatedGroup = useRef(null);
  const [tableData, setTableData] = useState<IUnAnnotatedAETable[]>([]);

  const [nPerPage, _] = useState(10);
  const [topN, setTopN] = useState(100);
  const [pageN, setPageN] = useState(0);
  const [tabName, setTabName] = useState(AnnotationTypeEnum.ONGOING);

  useEffect(() => {
    async function getData(
      userId: number,
      tabName: AnnotationTypeEnum,
      pageN: number,
    ) {
      const res = await withLoading(() =>
        fetchUnannotatedAETableByUserIdv2(
          userId,
          AnnotationCategoryEnum.CLINICAL_TRIAL_TABLE,
          pageN * nPerPage,
          nPerPage,
          tabName === AnnotationTypeEnum.COMPLETE,
          tabName === AnnotationTypeEnum.AI,
        ),
      );
      const count = await withLoading(() =>
        fetchUnannotatedAETableByUserIdCountv2(
          userId,
          AnnotationCategoryEnum.CLINICAL_TRIAL_TABLE,
          tabName === AnnotationTypeEnum.COMPLETE,
          tabName === AnnotationTypeEnum.AI,
        ),
      );
      handleResponse(res);
      handleResponse(count);
      if (count.success) setTopN(count.data ?? 0);
      if (res.success) setTableData(res.data ?? []);
    }

    if (isLoadingAuth) return;
    if (credentials.length === 0) return;
    if (!userId) return;
    getData(userId as number, tabName, pageN);
    (refUnannotatedGroup.current as any).scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabName, pageN, isLoadingAuth, userId]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
        h-[81vh] sm:h-[89vh] overflow-y-scroll
        ${isLoadingv2 ? "animate-pulse" : ""}`}
        ref={refUnannotatedGroup}
      >
        <div
          className="px-2 py-24 flex flex-col justify-center 
          items-center align-center w-full"
        >
          <div
            role="status"
            className={`absolute left-1/2 top-1/2 transition-opacity duration-700
            -translate-x-1/2 -translate-y-1/2 ${isLoadingv2 ? "opacity-1" : "opacity-0"}`}
          >
            <Spinner />
            <span className="sr-only">Loading...</span>
          </div>

          <div className="sm:w-1/2 flex flex-col mt-8 w-full px-1 pt-5 pb-5 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center space-x-1">
                <TypographyH2>CT Table Annotations</TypographyH2>
              </div>
              <BackBtn />
            </div>
          </div>
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
                                    data.clinical_trial_table!.content.table.slice(
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
                          let redirectUrl = `/annotate/fdalabel/${data.fdalabel.setid}/clinical_trial_table/${data.idx}`;
                          if (tabName === AnnotationTypeEnum.AI) {
                            redirectUrl = `${redirectUrl}/ai`;
                          }
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
            <PaginationBar
              topN={topN}
              pageN={pageN}
              nPerPage={nPerPage}
              setPageN={(i: number) => {
                setPageN(i);
              }}
            />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
