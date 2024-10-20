"use client";
import { Spinner, TypographyH2, ExpandableBtn } from "@/components";
import { ProtectedRoute, useAuth, useLoader } from "@/contexts";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Page() {
  const router = useRouter();
  const { userId, credentials, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const refDiscussionGroup = useRef(null);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
        h-[83vh] sm:h-[90vh] overflow-y-scroll
        ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
        ref={refDiscussionGroup}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div
            role="status"
            className={`absolute left-1/2 top-1/2 transition-opacity duration-700
            -translate-x-1/2 -translate-y-1/2 ${isLoading || isLoadingAuth ? "opacity-1" : "opacity-0"}`}
          >
            <Spinner />
            <span className="sr-only">Loading...</span>
          </div>
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-1 pt-5 pb-5 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center space-x-1">
                <TypographyH2>Feedbacks</TypographyH2>
              </div>
              <button
                className="p-2 aspect-square
            bg-green-300 rounded-full text-black hover:bg-green-500"
                onClick={async () => {}}
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14m-7 7V5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
