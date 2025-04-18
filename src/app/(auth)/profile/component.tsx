"use client";
import { ProtectedRoute } from "@/components";
import { useAuth, useLoader } from "@/contexts";
import { useState, useEffect } from "react";
import { fetchUserInfoById } from "@/http/backend";
import { useRouter } from "next/navigation";
import { IUser } from "@/types";
import ProfileBar from "./profile-bar";

export default function Profile() {
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
          h-[83vh] sm:h-[90vh] overflow-y-scroll
          ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
      >
        <div
          className="mt-[10rem] flex flex-col
           content-center items-center
        "
        >
          <div className="w-11/12 sm:w-7/12 flex flex-col space-y-10">
            <ProfileBar
              {...{
                username: profileInfo?.username! as string,
                role: profileInfo?.role!,
              }}
            >
              <p className="leading-relaxed mb-1">{profileInfo?.email!}</p>
            </ProfileBar>

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
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
