"use client";

import { Spinner, TypographyH2 } from "@/components";
import { ProtectedRoute, useAuth, useLoader } from "@/contexts";
import { useRouter } from "next/navigation";

export default function Forum() {
  const router = useRouter();
  const { setIsAuthenticated, credentials, role, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]
        ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          {(isLoading || isLoadingAuth) && (
            <div
              role="status"
              className="absolute left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2"
            >
              <Spinner />
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
            <TypographyH2>Forum</TypographyH2>
            <p className="leading-relaxed mb-5">
              Connect to our forum that accelerates our product developments,
              improves AI transparency, and builds AI safety and trust.
            </p>
            <button
              type="button"
              className="text-white bg-indigo-500 border-0 py-3
                  flex justify-between content-center text-center
                  align-middle items-center 
                  px-6 focus:outline-none hover:bg-indigo-600
                  rounded text-2xl w-full"
              onClick={() => router.push("/forum/feedback")}
            >
              <p>Feedback</p>
            </button>
            <p className="px-6 mb-1 text-xs text-right">
              Submit feedback that involves Feature Request, Enhancement, or
              Dicussion here.
            </p>
            <button
              type="button"
              className="text-white bg-indigo-500 border-0 py-3
                  flex justify-between content-center text-center
                  align-middle items-center 
                  px-6 focus:outline-none hover:bg-indigo-600
                  rounded text-2xl w-full"
              onClick={() => router.push("/forum/quality")}
            >
              <p>Quality Assurance</p>
            </button>
            <p className="px-6 mb-1 text-xs text-right">
              Group data to monitor Data Pipeline and AI Enrichment performance.
            </p>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
