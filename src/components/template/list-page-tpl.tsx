"use client";

import React from "react";
import { PulseTemplate } from "./pulse-tpl";

export const ListPageTemplate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PulseTemplate overflowY={true}>
      <div
        className="mt-[10rem] flex flex-col
                    content-center items-center
                    pb-10"
      >
        <div className="w-11/12 sm:w-7/12 flex flex-col space-y-3">
          {children}
        </div>
      </div>
    </PulseTemplate>
  );
};
