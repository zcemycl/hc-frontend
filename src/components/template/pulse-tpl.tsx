"use client";
import { useLoader } from "@/contexts";
import React from "react";

export const PulseTemplate = ({
  children,
  refSection,
}: {
  children: React.ReactNode;
  refSection?: React.RefObject<HTMLElement>;
}) => {
  const { isLoadingv2 } = useLoader();
  return (
    <section
      className={`text-gray-400 bg-gray-900 body-font 
        h-[81vh] sm:h-[89vh] overflow-y-scroll
        ${isLoadingv2 ? "animate-pulse" : ""}`}
      ref={refSection}
    >
      {children}
    </section>
  );
};
