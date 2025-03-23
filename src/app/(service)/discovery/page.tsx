"use client";

import { ProtectedRoute } from "@/contexts";
import VisPanel from "./vis-panel";

export default function Discovery() {
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div className="flex flex-col container pt-24 mx-auto px-10">
          <div className="sm:w-1/2 flex flex-col w-screen space-y-2">
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              Discovery
            </h2>
          </div>
          <VisPanel />
        </div>
      </section>
    </ProtectedRoute>
  );
}
