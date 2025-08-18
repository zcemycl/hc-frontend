"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { booleanDummySetState, TBooleanDummySetState } from "@/types";
import { usePathname } from "next/navigation";
import { max_loading_period } from "@/constants";

interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: TBooleanDummySetState;
}

export const LoaderContext = createContext<any>({});

export const LoaderProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [loadingCountv2, setLoadingCountv2] = useState(0);
  const isLoadingv2 = loadingCountv2 > 0;
  const [loadError, setLoadError] = useState<string | null>(null);

  // useEffect(() => {
  //   console.log(pathname)
  //   setIsLoading(true);

  //   const timeout = setTimeout(() => {
  //     setIsLoading(false);
  //   }, max_loading_period); // Adjust this based on real API calls

  //   return () => clearTimeout(timeout);
  // }, [pathname]);

  useEffect(() => {
    if (pathname !== prevPath.current) {
      console.log("useloader", pathname, prevPath);
      setLoadingCountv2((c) => c + 1);
      setIsLoading(true);
      prevPath.current = pathname;
    }
  }, [pathname]);

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        setIsLoading,
        loadingCountv2,
        setLoadingCountv2,
        isLoadingv2,
        loadError,
        setLoadError,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
