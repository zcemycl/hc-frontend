"use client";
import { useLoader } from "@/contexts";
import React from "react";

export const PulseTemplate = ({
  children,
  refSection,
  overflowX,
  overflowY,
}: {
  children: React.ReactNode;
  refSection?: React.RefObject<HTMLElement>;
  overflowX?: boolean;
  overflowY?: boolean;
}) => {
  const { isLoadingv2 } = useLoader();
  return (
    <section
      className={`text-gray-400 bg-gray-900 body-font 
        h-[81vh] sm:h-[89vh] overflow-y-auto
        ${overflowX ? "overflow-x-auto" : "overflow-x-hidden"}
        ${overflowY ? "overflow-y-auto" : "overflow-y-hidden"}
        ${isLoadingv2 ? "animate-pulse" : ""}`}
      ref={refSection}
    >
      {children}
    </section>
  );
};
