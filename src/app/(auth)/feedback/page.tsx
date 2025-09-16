"use client";

import { TypographyH2, ProtectedRoute, PulseTemplate } from "@/components";

export default function Feedback() {
  return (
    <ProtectedRoute>
      <PulseTemplate overflowY={true}>
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-10 pt-10 pb-5">
            <div className="flex justify-between">
              <TypographyH2>Feedback</TypographyH2>
            </div>
          </div>
        </div>
      </PulseTemplate>
    </ProtectedRoute>
  );
}
