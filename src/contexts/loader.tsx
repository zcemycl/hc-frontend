"use client";
import React, { createContext, useContext, useState, useMemo } from "react";
import { booleanDummySetState, TBooleanDummySetState } from "@/types";

interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: TBooleanDummySetState;
}

export const LoaderContext = createContext<LoaderContextType>({
  isLoading: false,
  setIsLoading: booleanDummySetState,
});

export const LoaderProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const LoaderProviderValue = useMemo<LoaderContextType>(() => {
    return {
      isLoading,
      setIsLoading,
    };
  }, [isLoading, setIsLoading]);

  return (
    <LoaderContext.Provider value={LoaderProviderValue}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
