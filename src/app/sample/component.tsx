"use client";
import { useContext } from "react";
import { SampleContext } from "./context";
import { PulseTemplate } from "@/components";

export default function Component() {
  const { tabName, count } = useContext(SampleContext);
  return (
    <PulseTemplate overflowY={true}>
      <div
        className="flex flex-col px-10 sm:px-5 py-24
                items-center align-middle"
      >
        {tabName}
        {count}
      </div>
    </PulseTemplate>
  );
}
