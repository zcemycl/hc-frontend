"use client";
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
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              Annotation
            </h2>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
