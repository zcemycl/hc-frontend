"use client";
import { TypographyH2, PaginationBar, ProtectedRoute } from "@/components";
import { useAuth, useLoader } from "@/contexts";
import { useState, useEffect, useCallback } from "react";
import { convert_datetime_to_simple } from "@/utils";
import { useRouter } from "next/navigation";
import {
  IHistory,
  IUser,
  SearchActionEnum,
  UserHistoryCategoryEnum,
} from "@/types";
import {
  fetchHistoryByUserId,
  fetchHistoryByUserIdCount,
  fetchUserInfoById,
} from "@/http/backend";

export default function Page() {
  const router = useRouter();
  const { userId, credentials, setIsAuthenticated, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [countHistory, setCountHistory] = useState(0);
  const [nPerPage, _] = useState(10);
  const [pageNHistory, setPageNHistory] = useState(0);

  const setHistoryData = useCallback(async (id: number, pageN: number) => {
    const historyInfo = await fetchHistoryByUserId(
      id,
      nPerPage * pageN,
      nPerPage,
    );
    setHistory(historyInfo);
  }, []);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!userId) return;
    setHistoryData(userId, pageNHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId, pageNHistory]);

  useEffect(() => {
    async function getProfile(id: number) {
      const userInfo = await fetchUserInfoById(id);
      setProfileInfo({ ...profileInfo, ...userInfo });
      const historyCount = await fetchHistoryByUserIdCount(id);
      setCountHistory(historyCount);
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
  }, [isLoadingAuth, userId]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
          h-[83vh] sm:h-[90vh] overflow-y-scroll
          ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
      >
        <div
          className="mt-[10rem] flex flex-col
           content-center items-center
        "
        >
          <div className="w-7/12 flex flex-col space-y-3">
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between">
                <TypographyH2>
                  {profileInfo?.username?.toUpperCase()}
                </TypographyH2>
                <span className="leading-relaxed mb-1">
                  {profileInfo?.role!}
                </span>
              </div>
              <p className="leading-relaxed mb-1">{profileInfo?.email!}</p>
            </div>
            <hr className="mb-2" />
            <TypographyH2>Search Activities X{countHistory}</TypographyH2>
            <div className="flex flex-col space-x-2">
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
            </div>
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
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
