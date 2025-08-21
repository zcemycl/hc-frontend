"use client";
import { TypographyH2 } from "@/components";
import { useAuth, useOpenBar } from "@/contexts";
import Link from "next/link";
import { useEffect } from "react";
import { fetchApiLogout } from "@/http/internal";

export default function Logout() {
  const { setIsAuthenticated, setCredentials, isLoadingAuth, setUserData } =
    useAuth();
  const { setIsDropDownOpen, setIsSideBarOpen } = useOpenBar();
  useEffect(() => {
    async function signOut() {
      const _ = await fetchApiLogout();
    }
    if (isLoadingAuth) return;
    setIsAuthenticated(false);
    setUserData(null);
    setCredentials("{}");
    setIsDropDownOpen(false);
    setIsSideBarOpen(false);
    signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);
  return (
    <section className="text-gray-400 bg-gray-900 body-font h-[81vh] sm:h-[89vh]">
      <div
        className="container px-2 py-24 mx-auto grid justify-items-center
    "
      >
        <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10">
          <TypographyH2>Logout</TypographyH2>
          <p className="leading-relaxed mb-5">
            Thank you for using our Healthcare Platform RXScope website.
          </p>
          <p className="leading-relaxed mb-5">We love to see you again.</p>
          <p className="leading-relaxed mb-5">
            You have been log out. To log in again, please click{" "}
            <Link className="text-green-400" href="/login">
              HERE
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
