"use client";

import { PulseTemplate } from "@/components";
import { ARROW_ICON_URI } from "@/icons/bootstrap";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();
  return (
    <PulseTemplate>
      <div
        className="container px-2 py-24 mx-auto grid justify-items-center
      "
      >
        <div className="flex flex-col mt-8 w-screen p-10 space-y-2">
          <h2 className="font-bold text-white text-2xl">
            Ooops... Sorry, Something went wrong!
          </h2>
          <h3 className="text-white font-semibold">
            Please try the following steps to fix the issue:
          </h3>
          <ol className="list-decimal list-inside text-white space-y-2">
            <li>Contact the website admin</li>
            <li className="list-item flex-row space-x-3 items-center content-center align-middle">
              <span>Reload Page</span>
              <button
                onClick={() => window.location.reload()}
                className="rounded bg-blue-600 p-1
                  text-white hover:bg-blue-700 -rotate-90"
              >
                <img src={ARROW_ICON_URI} alt="back" />
              </button>
            </li>
            <li>Clear cookies</li>
            <li className="list-item flex-row space-x-3 items-center">
              <span>Back to Home Page</span>
              <button
                onClick={() => router.push("/")}
                className="rounded bg-blue-600 p-1
                  text-white hover:bg-blue-700 -rotate-90"
              >
                <img src={ARROW_ICON_URI} alt="back" />
              </button>
            </li>
          </ol>
        </div>
      </div>
    </PulseTemplate>
  );
}
