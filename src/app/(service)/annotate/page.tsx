"use client";
import { TypographyH2 } from "@/components";
import { ProtectedRoute, useAuth } from "@/contexts";

export default function Annotate() {
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
    "
        >
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
            <TypographyH2>Annotation</TypographyH2>
            <p className="leading-relaxed mb-5">
              Our aim is to build robust and reliable AI models to digest drug
              data. We would need domain knowledge from world class expertise to
              help training our AI.
            </p>
            <p className="leading-relaxed mb-5">
              We value your help to accelerating our model training and
              evaluation.
            </p>
            <TypographyH2>Tasks</TypographyH2>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
