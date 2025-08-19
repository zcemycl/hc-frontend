"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useTransition,
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
  const [isPending] = useTransition();
  const prevPath = useRef(pathname);
  const [loadingCountv2, setLoadingCountv2] = useState(0);
  const isLoadingv2 = loadingCountv2 > 0;
  const [loadError, setLoadError] = useState<string | null>(null);

  const withLoading = async <T,>(fn: () => Promise<T>): Promise<T> => {
    console.log("trigger withloading increment");
    setLoadingCountv2((c) => c + 1);
    try {
      return await fn();
    } finally {
      setLoadingCountv2((c) => c - 1); // always decrement
      console.log("trigger withloading decrement");
    }
  };

  useEffect(() => {
    console.log("v2", isLoadingv2, loadingCountv2);
  }, [isLoadingv2, loadingCountv2]);

  useEffect(() => {
    if (pathname !== prevPath.current) {
      console.log("useloader", pathname, prevPath);
      // setLoadingCountv2((c) => c + 1);
      prevPath.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    // startTransition kicks in when path changes
    if (isPending) {
      setLoadingCountv2((c) => c + 1);
    } else {
      setLoadingCountv2((c) => Math.max(c - 1, 0));
    }
  }, [isPending, pathname]);

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
        withLoading,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
