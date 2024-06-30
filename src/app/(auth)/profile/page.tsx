"use client";
import { TypographyH2 } from "@/components";
import { ProtectedRoute, useAuth } from "@/contexts";
import { useState, useEffect, useId } from "react";
import { fetchUserInfoById } from "@/http/backend";
import { useRouter } from "next/navigation";
import { IUser } from "@/types";

export default function Profile() {
  const { userId, credentials, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);

  useEffect(() => {
    async function getProfile(id: number, token: string) {
      const userInfo = await fetchUserInfoById(id, token);
      setProfileInfo({ ...profileInfo, ...userInfo });
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
              <p className="leading-relaxed mb-1">No Record ...</p>
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
