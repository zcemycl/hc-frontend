"use client";
import { TypographyH2 } from "@/components";
import { ProtectedRoute, useAuth } from "@/contexts";
import { useState, useEffect } from "react";
import { fetchHistoryByUserId, fetchUserInfoById } from "@/http/backend";
import { useRouter } from "next/navigation";
import {
  IUser,
  SearchActionEnum,
  UserHistoryCategoryEnum,
  IHistory,
} from "@/types";

export default function Profile() {
  const { userId, credentials, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);
  const [history, setHistory] = useState<IHistory[]>([]);

  useEffect(() => {
    async function getProfile(id: number, token: string) {
      const userInfo = await fetchUserInfoById(id, token);
      setProfileInfo({ ...profileInfo, ...userInfo });
      const historyInfo = await fetchHistoryByUserId(id, token);
      setHistory(historyInfo);
    }
    if (credentials.length === 0) {
      setIsAuthenticated(false);
      router.push(
        process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/logout" : "/",
      );
    }
    const credJson = JSON.parse(credentials);
    getProfile(userId as number, credJson.AccessToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh] overflow-y-scroll">
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-10 pt-10 pb-5">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <TypographyH2>
                  {profileInfo?.username!.toUpperCase()}
                  {" 's"} History
                </TypographyH2>
                <p className="leading-relaxed mb-1">{profileInfo?.role!}</p>
              </div>
              <p className="leading-relaxed mb-1">{profileInfo?.email!}</p>

              <hr className="mb-2" />
              <TypographyH2>Search</TypographyH2>
              {history.length === 0 ? (
                <p className="leading-relaxed mb-1">No Record ...</p>
              ) : (
                history
                  .filter((x) => x.category === UserHistoryCategoryEnum.SEARCH)
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
                      focus:bg-blue-200 transition
                      justify-start content-start
                      rounded px-2 hover:text-black"
                      >
                        <div className="flex justify-between">
                          <p className="leading-relaxed">{x.detail.action}</p>
                          <p className="leading-relaxed">
                            {x.detail.additional_settings.queryType}
                          </p>
                        </div>
                        <p className="text-2">{`[\"${x.detail.query.join('", "')}\"]`}</p>
                      </button>
                    );
                  })
              )}
              <hr className="mb-2" />
              <TypographyH2>Annotation</TypographyH2>
              <p className="leading-relaxed mb-1">No Record ...</p>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
