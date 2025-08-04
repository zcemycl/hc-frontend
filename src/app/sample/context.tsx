"use client";

import React, { createContext } from "react";

export const SampleContext = createContext<any>({});

export const SampleProvider = ({
  tabName,
  count,
  children,
}: {
  tabName: string;
  count: number;
  children?: React.ReactNode;
}) => {
  return (
    <SampleContext.Provider value={{ tabName, count }}>
      {children}
    </SampleContext.Provider>
  );
};
