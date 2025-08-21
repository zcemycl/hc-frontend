"use client";
import { ProtectedRoute } from "@/components";
import { useAuth, useLoader } from "@/contexts";
import ProfileBar from "../profile-bar";
import { useEffect, useState } from "react";
import { fetchUserInfoByIdv2 } from "@/http/backend";
import { IUser } from "@/types";
import { useApiHandler } from "@/hooks";

export default function Page() {
  const { userId, isLoadingAuth } = useAuth();
  const { isLoadingv2 } = useLoader();
  const { handleResponse } = useApiHandler();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);

  useEffect(() => {
    async function getProfile(id: number) {
      const userInfo = await fetchUserInfoByIdv2(id);
      handleResponse(userInfo);
      if (userInfo.success) setProfileInfo(userInfo.data ?? null);
    }
    if (isLoadingAuth) return;
    if (!userId) return;
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
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
