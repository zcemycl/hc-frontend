"use client";

import { createContext } from "react";

type IInitialData = Record<string, any>;

export const LocalGenericContext = createContext<any>({});

export const LocalGenericProvider = ({
  initialData,
  children,
}: {
  initialData: IInitialData;
  children?: React.ReactNode;
}) => {
  return (
    <LocalGenericContext.Provider value={{ initialData }}>
      {children}
    </LocalGenericContext.Provider>
  );
};
