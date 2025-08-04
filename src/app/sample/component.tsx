"use client";
import { useContext } from "react";
import { SampleContext } from "./context";

export default function Component() {
  const { tabName, count } = useContext(SampleContext);
  return (
    <section
      className="
            text-gray-400 bg-gray-900 body-font 
            h-[81vh] sm:h-[89vh] overflow-y-auto
            overflow-x-hidden"
    >
      <div
        className="flex flex-col px-10 sm:px-5 py-24
                items-center align-middle"
      >
        {tabName}
        {count}
      </div>
    </section>
  );
}
