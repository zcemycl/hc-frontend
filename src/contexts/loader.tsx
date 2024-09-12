"use client";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  booleanDummySetState,
  stringDummySetState,
  TBooleanDummySetState,
  TStringDummySetState,
} from "@/types";

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
