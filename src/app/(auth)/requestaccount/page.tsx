"use client";

import { PulseTemplate } from "@/components";

export default function RequestAccount() {
  return (
    <PulseTemplate>
      <div
        className="container px-2 py-24 mx-auto grid justify-items-center
        "
      >
        <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10">
          <h2 className="text-white text-lg mb-1 font-medium title-font">
            Thank you for your interest!
          </h2>
          <p className="leading-relaxed mb-5">
            We will process your request as soon as possible and contact your
            through email.
          </p>
        </div>
      </div>
    </PulseTemplate>
  );
}
