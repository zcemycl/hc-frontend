"use client";

import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { IFdaVersions } from "@/types";
import React, { createContext, useMemo, useState } from "react";

export const FdaVersionsContext = createContext<any>({});

export const FdaVersionsProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [versions, setVersions] = useState<IFdaVersions>(
    DEFAULT_FDALABEL_VERSIONS,
  );

  const FdaVersionsProviderValue = useMemo(() => {
    return {
      versions,
      setVersions,
    };
  }, [versions]);

  return (
    <FdaVersionsContext.Provider value={FdaVersionsProviderValue}>
      {children}
    </FdaVersionsContext.Provider>
  );
};
