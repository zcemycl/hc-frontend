"use client";
import { ProtectedRoute, PulseTemplate } from "@/components";

export default function Chatbot() {
  return (
    <ProtectedRoute>
      <PulseTemplate>
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
    "
        >
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              Chatbot
            </h2>
          </div>
        </div>
      </PulseTemplate>
    </ProtectedRoute>
  );
}
