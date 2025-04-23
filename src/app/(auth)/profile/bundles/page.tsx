"use client";
import { ProtectedRoute } from "@/components";
import { useAuth, useLoader } from "@/contexts";
import { useRouter } from "next/navigation";
import ProfileBar from "../profile-bar";
import { useEffect, useState } from "react";
import { fetchUserInfoById } from "@/http/backend";
import { IUser } from "@/types";

export default function Page() {
  const { userId, credentials, setIsAuthenticated, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);

  useEffect(() => {
    async function getProfile(id: number) {
      const userInfo = await fetchUserInfoById(id);
      setProfileInfo({ ...profileInfo, ...userInfo });
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
              h-[81vh] sm:h-[89vh] overflow-y-scroll
              ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
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
