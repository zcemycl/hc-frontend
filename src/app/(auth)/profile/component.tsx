"use client";
import {
  ListPageTemplate,
  ProtectedRoute,
  PulseTemplate,
  Spinner,
} from "@/components";
import { useAuth, useLoader } from "@/contexts";
import { useState, useEffect } from "react";
import { fetchUserInfoByIdv2 } from "@/http/backend";
import { useRouter } from "next/navigation";
import { IUser } from "@/types";
import ProfileBar from "./profile-bar";
import { useApiHandler } from "@/hooks";

export default function Profile() {
  const { handleResponse } = useApiHandler();
  const { userId, isLoadingAuth } = useAuth();
  const { isLoadingv2 } = useLoader();
  const router = useRouter();
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
      <ListPageTemplate>
        {isLoadingv2 ? (
          <Spinner />
        ) : (
          <ProfileBar
            {...{
              username: profileInfo?.username! as string,
              role: profileInfo?.role!,
            }}
          >
            <p className="leading-relaxed mb-1">{profileInfo?.email!}</p>
          </ProfileBar>
        )}

        <div
          className="
                    grid gap-4
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    content-center
                    place-content-center
                    place-items-center
                "
        >
          {[
            ["History", "Browse your search history.", "/history"],
            [
              "Annotation",
              "View your supports in building robust AI models",
              "/annotations",
            ],
            [
              "Bundle",
              "Group your medicines of interest to compare, and let the system learn your preference.",
              "/bundles",
            ],
          ].map((v) => (
            <div
              className="flex flex-col w-full
                                    h-fit
                                "
              key={`btn-group-${v[0]}`}
            >
              <div className="group flex flex-col">
                <button
                  className="p-4 sm:p-6
                        rounded-md
                        text-black font-bold
                        text-md
                        hover:bg-emerald-500
                        bg-emerald-300"
                  onClick={() => router.push(`profile${v[2]}`)}
                >
                  {v[0]}
                </button>
                <span
                  className="max-h-0 overflow-hidden 
                        transition-all duration-300 
                        ease-in-out group-hover:max-h-40"
                >
                  {v[1]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
