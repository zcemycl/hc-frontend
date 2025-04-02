"use client";
import { useState } from "react";
import { ProtectedRoute, TypographyH2 } from "@/components";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div className="px-2 py-24 flex flex-col justify-center items-center align-center">
          <div
            className="sm:w-1/2 flex flex-col mt-8 
            w-full px-1 pt-5 pb-5 space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center space-x-1">
                <TypographyH2>Indication Annotations</TypographyH2>
              </div>
              <button
                onClick={() => {
                  router.back();
                }}
                className="bg-purple-700 rounded p-2 
                text-white hover:bg-purple-800"
              >
                <img
                  src="https://icons.getbootstrap.com/assets/icons/arrow-return-left.svg"
                  alt="back"
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
