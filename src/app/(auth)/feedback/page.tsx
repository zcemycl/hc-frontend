"use client";

import { TypographyH2, ProtectedRoute } from "@/components";

export default function Feedback() {
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[81vh] sm:h-[89vh] overflow-y-scroll">
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-10 pt-10 pb-5">
            <div className="flex justify-between">
              <TypographyH2>Feedback</TypographyH2>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
