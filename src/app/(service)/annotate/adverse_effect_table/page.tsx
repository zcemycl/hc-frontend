"use client";
import {
  PaginationBar,
  TypographyH2,
  Table,
  Spinner,
  ExpandableBtn,
  AETableVerDropdown,
  ProtectedRoute,
} from "@/components";
import {
  fetchUnannotatedAETableByUserId,
  fetchUnannotatedAETableByUserIdCount,
} from "@/http/backend";
import { useAuth, useAETableAnnotation, useLoader } from "@/contexts";
import {
  AnnotationCategoryEnum,
  IBaseTable,
  IUnAnnotatedAETable,
} from "@/types";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoIcon } from "@/icons";
import {
  AnnotationTypeEnum,
  AETableVerEnum,
  aeTableVersionMap,
} from "@/constants";
import { AnnotationTypeDropdown } from "./AnnotationTypeDropdown";
import { transformData } from "@/utils";

export default function Page() {
  const router = useRouter();
  const { userId, credentials, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const {
    aePageCache,
    tabName,
    setTabName,
    saveAETableAnnotationPageCache,
    saveTabPage,
    pageN,
    setPageN,
    aiPageN,
    ongoingPageN,
    completePageN,
  } = useAETableAnnotation();
  const [version, setVersion] = useState(AETableVerEnum.v0_0_1);
  const [tableData, setTableData] = useState<IUnAnnotatedAETable[]>([]);
  const [nPerPage, _] = useState(10);
  const [topN, setTopN] = useState(0);
  const refUnannotatedGroup = useRef(null);

  useEffect(() => {
    async function getData(
      userId: number,
      tabName: AnnotationTypeEnum,
      pageN: number,
    ) {
      const res = await fetchUnannotatedAETableByUserId(
        userId,
        AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
        pageN * nPerPage,
        nPerPage,
        tabName === AnnotationTypeEnum.COMPLETE,
        tabName === AnnotationTypeEnum.AI,
        version,
      );
      const count = await fetchUnannotatedAETableByUserIdCount(
        userId,
        AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
        tabName === AnnotationTypeEnum.COMPLETE,
        tabName === AnnotationTypeEnum.AI,
        version,
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

    console.log(credentials, isLoadingAuth, userId);
    setIsLoading(true);
    getData(userId as number, tabName, pageN);
    (refUnannotatedGroup.current as any).scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabName, pageN, isLoadingAuth, userId, version]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
        h-[83vh] sm:h-[90vh] overflow-y-scroll
        ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
        ref={refUnannotatedGroup}
      >
        <div className="px-2 py-24 flex flex-col justify-center items-center align-center">
          <div
            role="status"
            className={`absolute left-1/2 top-1/2 transition-opacity duration-700
            -translate-x-1/2 -translate-y-1/2 ${isLoading || isLoadingAuth ? "opacity-1" : "opacity-0"}`}
          >
            <Spinner />
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="sm:w-1/2 flex flex-col mt-8 
            w-full px-1 pt-5 pb-5 space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center space-x-1">
                <TypographyH2>AE Table Annotations</TypographyH2>
                <AnnotationTypeDropdown
                  queryType={tabName}
                  setQueryType={(q) => {
                    setTabName(q);
                    let tmpCache = aePageCache;
                    let pageN_ = pageN;
                    if (q === AnnotationTypeEnum.AI && "aiPageN" in tmpCache) {
                      // setPageN(tmpCache["aiPageN"] as number);
                      setPageN(aiPageN);
                      // pageN_ = tmpCache["aiPageN"] as number;
                    }
                    if (
                      q === AnnotationTypeEnum.COMPLETE &&
                      "completePageN" in tmpCache
                    ) {
                      // setPageN(tmpCache["completePageN"] as number);
                      setPageN(completePageN);
                      // pageN_ = tmpCache["completePageN"] as number;
                    }
                    if (
                      q === AnnotationTypeEnum.ONGOING &&
                      "ongoingPageN" in tmpCache
                    ) {
                      // setPageN(tmpCache["ongoingPageN"] as number);
                      setPageN(ongoingPageN);
                      // pageN_ = tmpCache["ongoingPageN"] as number;
                    }
                    saveAETableAnnotationPageCache(q);
                  }}
                  additionalResetCallback={() => {}}
                />
                <AETableVerDropdown
                  verType={version}
                  setVerType={(q) => {
                    console.log(q);
                    setVersion(q);
                  }}
                  additionalResetCallback={() => {}}
                />
              </div>

              <button
                onClick={() => {
                  saveAETableAnnotationPageCache();
                  router.back();
                }}
                className="bg-purple-700 rounded p-2 
                text-white hover:bg-purple-800"
              >
                Back
              </button>
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
                          setIsLoading(true);
                          const params = new URLSearchParams();
                          params.append("version", version);
                          let redirectUrl = `/annotate/fdalabel/${data.fdalabel.setid}/adverse_effect_table/${data.idx}`;
                          if (tabName === AnnotationTypeEnum.AI) {
                            redirectUrl = `${redirectUrl}/ai`;
                          }
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
            <PaginationBar
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
        </div>
      </section>
    </ProtectedRoute>
  );
}
