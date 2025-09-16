"use client";
import {
  TypographyH2,
  ProtectedRoute,
  PaginationBar2,
  PulseTemplate,
} from "@/components";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import { useState, useEffect, useCallback, useContext } from "react";
import { convert_datetime_to_simple } from "@/utils";
import { useRouter } from "next/navigation";
import {
  IHistory,
  IUser,
  SearchActionEnum,
  UserHistoryCategoryEnum,
} from "@/types";
import {
  fetchHistoryByUserIdv2,
  fetchHistoryByUserIdCountv2,
  fetchUserInfoByIdv2,
} from "@/http/backend";
import ProfileBar from "../profile-bar";
import { useApiHandler } from "@/hooks";

export default function Page() {
  const router = useRouter();
  const { handleResponse } = useApiHandler();
  const { userId, isLoadingAuth } = useAuth();
  const { withLoading } = useLoader();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [countHistory, setCountHistory] = useState(0);
  const [nPerPage, _] = useState(10);
  const [pageNHistory, setPageNHistory] = useState(0);
  const { setVersions } = useContext(FdaVersionsContext);

  const setHistoryData = useCallback(async (id: number, pageN: number) => {
    const historyInfoRes = await withLoading(() =>
      fetchHistoryByUserIdv2(id, nPerPage * pageN, nPerPage),
    );
    handleResponse(historyInfoRes);
    setHistory(historyInfoRes.data ?? []);
  }, []);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!userId) return;
    setHistoryData(userId, pageNHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId, pageNHistory]);

  useEffect(() => {
    async function getProfile(id: number) {
      const userInfo = await fetchUserInfoByIdv2(id);
      handleResponse(userInfo);
      if (userInfo.success) setProfileInfo(userInfo.data ?? null);
      const historyCount = await fetchHistoryByUserIdCountv2(id);
      handleResponse(historyCount);
      if (historyCount.success) setCountHistory(historyCount.data ?? 0);
    }
    if (isLoadingAuth) return;
    if (!userId) return;
    getProfile(userId as number);
  }, [isLoadingAuth, userId]);

  return (
    <ProtectedRoute>
      <PulseTemplate overflowY={true}>
        <div
          className="mt-[10rem] flex flex-col
           content-center items-center
        "
        >
          <div className="w-11/12 sm:w-7/12 flex flex-col space-y-3">
            <ProfileBar
              {...{
                username: profileInfo?.username! as string,
                role: profileInfo?.role!,
              }}
            />
            <hr className="mb-2" />
            <TypographyH2>Search Activities X{countHistory}</TypographyH2>
            <div className="flex flex-col space-y-1">
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
                          e.preventDefault();
                          if (
                            Object.keys(x.detail.additional_settings).includes(
                              "versions",
                            )
                          ) {
                            setVersions(x.detail.additional_settings.versions);
                            // setFdaVers(x.detail.additional_settings.versions.fdalabel);
                          }
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
            {countHistory / nPerPage > 1 && (
              <div className="flex justify-center space-x-1 flex-wrap">
                <PaginationBar2
                  topN={countHistory}
                  pageN={pageNHistory}
                  nPerPage={nPerPage}
                  setPageN={(i: number) => {
                    setPageNHistory(i);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </PulseTemplate>
    </ProtectedRoute>
  );
}
