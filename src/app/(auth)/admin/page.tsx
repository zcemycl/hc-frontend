"use client";
import { useRef } from "react";
import { TypographyH2 } from "@/components/typography";
import { ProtectedRoute } from "@/contexts";

export default function Admin() {
  const refUserGroup = useRef(null);
  return (
    <ProtectedRoute>
      <section
        className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh] overflow-y-scroll"
        ref={refUserGroup}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10">
            <TypographyH2>Admin Panel</TypographyH2>
          </div>
        </div>
        ]
      </section>
    </ProtectedRoute>
  );
}
