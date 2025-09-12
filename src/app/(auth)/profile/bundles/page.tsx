"use client";
import { ProtectedRoute, TypographyH2 } from "@/components";
import { useAuth, useLoader } from "@/contexts";
import ProfileBar from "../profile-bar";
import { useEffect, useState } from "react";
import {
  fetchBundlesByUserIdv2,
  fetchBundlesCountByUserIdv2,
  fetchUserInfoByIdv2,
} from "@/http/backend";
import { IBundle, IUser } from "@/types";
import { useApiHandler } from "@/hooks";

export default function Page() {
  const { userId, isLoadingAuth } = useAuth();
  const { isLoadingv2, withLoading } = useLoader();
  const { handleResponse } = useApiHandler();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);
  const [bundles, setBundles] = useState<IBundle[]>([]);
  const [bundlesCount, setBundlesCount] = useState(0);
  const nPerPage = 10;
  const [pageN, setPageN] = useState(0);

  useEffect(() => {
    async function getProfile(id: number) {
      const userInfo = await fetchUserInfoByIdv2(id);
      handleResponse(userInfo);
      if (userInfo.success) setProfileInfo(userInfo.data ?? null);
      const [tmpBundlesRes, tmpBundlesCount] = await withLoading(() =>
        Promise.all([
          fetchBundlesByUserIdv2(userId as number, nPerPage * pageN, nPerPage),
          fetchBundlesCountByUserIdv2(userId as number),
        ]),
      );
      handleResponse(tmpBundlesRes);
      setBundles(tmpBundlesRes.data ?? []);
      handleResponse(tmpBundlesCount);
      setBundlesCount(tmpBundlesCount.data ?? 0);
    }
    if (isLoadingAuth) return;
    getProfile(userId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId]);
  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
              h-[81vh] sm:h-[89vh] overflow-y-scroll
              ${isLoadingv2 ? "animate-pulse" : ""}`}
      >
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
            <TypographyH2>Bundles X{bundlesCount}</TypographyH2>
            <div className="flex flex-col space-y-1">
              {bundles.length === 0 ? (
                <p className="leading-relaxed mb-1">No Record ...</p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
