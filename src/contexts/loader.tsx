"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { booleanDummySetState, TBooleanDummySetState } from "@/types";
import { usePathname } from "next/navigation";
import { max_loading_period } from "@/constants";

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
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);

    if (pathname === "/login") return;

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, max_loading_period); // Adjust this based on real API calls

    return () => clearTimeout(timeout);
  }, [pathname]);

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
