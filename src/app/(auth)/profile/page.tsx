"use client";
import { TypographyH2, PaginationBar } from "@/components";
import { ProtectedRoute, useAuth, useLoader } from "@/contexts";
import { useState, useEffect } from "react";
import {
  fetchHistoryByUserId,
  fetchHistoryByUserIdCount,
  fetchUserInfoById,
  fetchUnannotatedAETableByUserId,
  fetchUnannotatedAETableByUserIdCount,
} from "@/http/backend";
import { useRouter } from "next/navigation";
import {
  IUser,
  SearchActionEnum,
  UserHistoryCategoryEnum,
  AnnotationCategoryEnum,
  IHistory,
  IUnAnnotatedAETable,
} from "@/types";
import { convert_datetime_to_simple } from "@/utils";

export default function Profile() {
  const { userId, credentials, setIsAuthenticated, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [tableData, setTableData] = useState<IUnAnnotatedAETable[]>([]);
  const [countAnnotated, setCountAnnotated] = useState(0);
  const [countHistory, setCountHistory] = useState(0);
  const [nPerPage, _] = useState(10);
  const [pageNHistory, setPageNHistory] = useState(0);
  const [pageNAnnotate, setPageNAnnotate] = useState(0);

  async function setHistoryData(id: number) {
    const historyInfo = await fetchHistoryByUserId(
      id,
      nPerPage * pageNHistory,
      nPerPage,
    );
    setHistory(historyInfo);
  }

  async function setAnnotationRecord(id: number) {
    const annotatedData = await fetchUnannotatedAETableByUserId(
      id,
      AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
      nPerPage * pageNAnnotate,
      nPerPage,
      true,
    );
    if (annotatedData !== undefined) setTableData(annotatedData);
  }

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!userId) return;
    setHistoryData(userId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId, pageNHistory]);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!userId) return;
    setAnnotationRecord(userId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId, pageNAnnotate]);

  useEffect(() => {
    async function getProfile(id: number) {
      const userInfo = await fetchUserInfoById(id);
      setProfileInfo({ ...profileInfo, ...userInfo });
      const historyCount = await fetchHistoryByUserIdCount(id);
      setCountHistory(historyCount);
      const numberAnnotated = await fetchUnannotatedAETableByUserIdCount(
        id,
        AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
        true,
      );
      setCountAnnotated(numberAnnotated);
    }
    if (isLoadingAuth) return;

    if (credentials.length === 0) {
      setIsAuthenticated(false);
      router.push(
        process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/logout" : "/",
      );
    }
    if (!userId) return;
    getProfile(userId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
          h-[83vh] sm:h-[90vh] overflow-y-scroll
          ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-10 pt-10 pb-5">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <TypographyH2>
                  {profileInfo?.username?.toUpperCase()}
                  {" 's"} History
                </TypographyH2>
                <p className="leading-relaxed mb-1">{profileInfo?.role!}</p>
              </div>
              <p className="leading-relaxed mb-1">{profileInfo?.email!}</p>

              <hr className="mb-2" />
              <TypographyH2>Search Activities X{countHistory}</TypographyH2>
              {!!history && history.length === 0 ? (
                <p className="leading-relaxed mb-1">No Record ...</p>
              ) : (
                history
                  ?.filter((x) => x.category === UserHistoryCategoryEnum.SEARCH)
                  .map((x, idx) => {
                    return (
                      <button
                        disabled={
                          x.detail.action === SearchActionEnum.COMPARE_AE
                        }
                        key={`history-${idx}`}
                        onClick={(e) => {
                          router.push(`/search?historyId=${x.id}`);
                        }}
                        className="hover:bg-green-200 
                        text-clip overflow-clip
                        focus:bg-blue-200 transition
                        justify-start content-start
                        rounded px-2 hover:text-black"
                      >
                        <div className="flex justify-between">
                          <p className="leading-relaxed">
                            {convert_datetime_to_simple(x.created_date)}
                          </p>
                          <p className="leading-relaxed">{x.detail.action}</p>
                          <p className="leading-relaxed">
                            {x.detail.additional_settings.queryType}
                          </p>
                        </div>
                        <p
                          className="text-xs text-left text-clip
                          whitespace-nowrap"
                        >
                          {`[\"${x.detail.query.join('", "')}\"]`}
                        </p>
                      </button>
                    );
                  })
              )}
              <div className="flex justify-center space-x-1 flex-wrap">
                <PaginationBar
                  topN={countHistory}
                  pageN={pageNHistory}
                  nPerPage={nPerPage}
                  setPageN={(i: number) => {
                    setPageNHistory(i);
                  }}
                />
              </div>
              <hr className="mb-2" />
              <TypographyH2>Annotation X{countAnnotated}</TypographyH2>
              {tableData.length === 0 ? (
                <p className="leading-relaxed mb-1">No Record ...</p>
              ) : (
                tableData.map((x, idx) => {
                  return (
                    <button
                      key={`history-annotation-${idx}`}
                      className="hover:bg-green-200 
                        text-clip overflow-clip
                        focus:bg-blue-200 transition
                        justify-start content-start
                        rounded px-2 hover:text-black"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(
                          `/annotate/fdalabel/${x.fdalabel.setid}/adverse_effect_table/${x.idx}`,
                        );
                      }}
                    >
                      <div className="flex justify-between">
                        <p className="leading-relaxed">
                          {convert_datetime_to_simple(x.created_date as string)}
                        </p>
                        <p className="leading-relaxed">
                          {x.fdalabel.tradename}
                        </p>
                        <p className="leading-relaxed">Table {x.idx}</p>
                      </div>
                    </button>
                  );
                })
              )}
              <div className="flex justify-center space-x-1 flex-wrap">
                <PaginationBar
                  topN={countAnnotated}
                  pageN={pageNAnnotate}
                  nPerPage={nPerPage}
                  setPageN={(i: number) => {
                    setPageNAnnotate(i);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
