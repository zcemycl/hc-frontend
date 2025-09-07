"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useTransition,
  SetStateAction,
  Dispatch,
} from "react";
import { usePathname } from "next/navigation";

export const LoaderContext = createContext<any>({});

export const LoaderProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawingGraph, setIsDrawingGraph] = useState(false);
  const pathname = usePathname();
  const [isPending] = useTransition();
  const prevPath = useRef(pathname);
  const [loadingCountv2, setLoadingCountv2] = useState(0);
  const isLoadingv2 = loadingCountv2 > 0;
  const [loadError, setLoadError] = useState<string | null>(null);

  const withGenericLoading = async <T,>(
    fn: () => Promise<T>,
    setLoadingCountFn: Dispatch<SetStateAction<number>>,
  ): Promise<T> => {
    console.log("trigger withloading increment");
    setLoadingCountFn((c) => c + 1);
    try {
      return await fn();
    } finally {
      setLoadingCountFn((c) => c - 1); // always decrement
      console.log("trigger withloading decrement");
    }
  };

  const withLoading = async <T,>(fn: () => Promise<T>): Promise<T> => {
    return withGenericLoading(fn, setLoadingCountv2);
  };

  useEffect(() => {
    console.log("v2", isLoadingv2, loadingCountv2);
  }, [isLoadingv2, loadingCountv2]);

  useEffect(() => {
    if (pathname !== prevPath.current) {
      console.log("useloader", pathname, prevPath);
      setLoadingCountv2((c) => c + 1);
      prevPath.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    // startTransition kicks in when path changes
    console.log("isPending", isPending);
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
        isDrawingGraph,
        setIsDrawingGraph,
        withGenericLoading,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
