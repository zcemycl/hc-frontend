"use client";

import { TypographyH2 } from "@/components";
import { usePathname } from "next/navigation";

export default function NotFound() {
  return (
    <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
      <div
        className="container px-2 py-24 mx-auto grid justify-items-center
      "
      >
        <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
          <TypographyH2>404 Not Found</TypographyH2>
          <p className="leading-relaxed mb-5">
            Ooopppsss... Something went wrong.
          </p>
          <p>The route {usePathname()} does not exist</p>
          <p className="leading-relaxed mb-5">
            Please report this through our Forum or try again later.
          </p>
        </div>
      </div>
    </section>
  );
}
