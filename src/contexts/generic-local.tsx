"use client";

import { IInitialData } from "@/types";
import { createContext } from "react";

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

export const LocalUtilityContext = createContext<any>({});

export const LocalUtilityProvider = ({
  utilities,
  children,
}: {
  utilities: IInitialData;
  children?: React.ReactNode;
}) => {
  return (
    <LocalUtilityContext.Provider value={{ utilities }}>
      {children}
    </LocalUtilityContext.Provider>
  );
};
