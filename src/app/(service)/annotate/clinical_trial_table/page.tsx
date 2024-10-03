"use client";

import {
  Spinner,
  TypographyH2,
  Table,
  ExpandableBtn,
  PaginationBar,
} from "@/components";
import { AnnotationTypeEnum } from "@/constants";
import { ProtectedRoute, useAuth, useLoader } from "@/contexts";
import {
  fetchUnannotatedAETableByUserId,
  fetchUnannotatedAETableByUserIdCount,
} from "@/http/backend";
import { GoIcon } from "@/icons";
import {
  AnnotationCategoryEnum,
  IBaseTable,
  IUnAnnotatedAETable,
} from "@/types";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Page() {
  const router = useRouter();
  const { userId, credentials, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const refUnannotatedGroup = useRef(null);
  const [tableData, setTableData] = useState<IUnAnnotatedAETable[]>([]);

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
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
      const res = await fetchUnannotatedAETableByUserId(
        userId,
        AnnotationCategoryEnum.CLINICAL_TRIAL_TABLE,
        pageN * nPerPage,
        nPerPage,
        tabName === AnnotationTypeEnum.COMPLETE,
        tabName === AnnotationTypeEnum.AI,
      );
      const count = await fetchUnannotatedAETableByUserIdCount(
        userId,
        AnnotationCategoryEnum.CLINICAL_TRIAL_TABLE,
        tabName === AnnotationTypeEnum.COMPLETE,
        tabName === AnnotationTypeEnum.AI,
      );
      if ("detail" in res) {
        router.push("/logout");
        return;
      }
      setTopN(count);
      setTableData(res);
    }

    if (isLoadingAuth) return;
    if (credentials.length === 0) return;
    if (!userId) return;
    setIsLoading(true);
    getData(userId as number, tabName, pageN);
    (refUnannotatedGroup.current as any).scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setHoverIdx(null);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabName, pageN, isLoadingAuth, userId]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
        h-[83vh] sm:h-[90vh] overflow-y-scroll
        ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
        ref={refUnannotatedGroup}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div
            role="status"
            className={`absolute left-1/2 top-1/2 transition-opacity duration-700
            -translate-x-1/2 -translate-y-1/2 ${isLoading || isLoadingAuth ? "opacity-1" : "opacity-0"}`}
          >
            <Spinner />
            <span className="sr-only">Loading...</span>
          </div>

          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-1 pt-5 pb-5 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center space-x-1">
                <TypographyH2>CT Table Annotations</TypographyH2>
              </div>
              <button
                onClick={() => {
                  router.back();
                }}
                className="bg-purple-700 rounded p-2 
                text-white hover:bg-purple-800"
              >
                Back
              </button>
            </div>
          </div>
          {tableData.map((data, idx) => {
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
                          table: data.clinical_trial_table!.content.table.slice(
                            0,
                            6,
                          ),
                        } as IBaseTable,
                      }}
                    />
                  </>
                }
                hoverCondition={hoverIdx == idx}
                onMouseOver={(e) => {
                  setHoverIdx(idx);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoading(true);
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
                    className={`transition duration-300
                  ${hoverIdx == idx ? "opacity-1 translate-x-0" : "opacity-0 -translate-x-1/2"}`}
                  >
                    <GoIcon />
                  </div>
                </>
              </ExpandableBtn>
            );
          })}
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
