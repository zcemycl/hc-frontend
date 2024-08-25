"use client";
import React, { useState, createContext, useContext, useMemo } from "react";
import { booleanDummySetState, TBooleanDummySetState } from "@/types";

interface OpenBarContextType {
  isDropDownOpen: boolean;
  setIsDropDownOpen: TBooleanDummySetState;
  isSideBarOpen: boolean;
  setIsSideBarOpen: TBooleanDummySetState;
}

export const OpenBarContext = createContext<OpenBarContextType>({
  isDropDownOpen: false,
  setIsDropDownOpen: booleanDummySetState,
  isSideBarOpen: false,
  setIsSideBarOpen: booleanDummySetState,
});

export const OpenBarProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const OpenBarProviderValue = useMemo<OpenBarContextType>(() => {
    return {
      isDropDownOpen,
      setIsDropDownOpen,
      isSideBarOpen,
      setIsSideBarOpen,
    };
  }, [isDropDownOpen, setIsDropDownOpen, isSideBarOpen, setIsSideBarOpen]);

  return (
    <OpenBarContext.Provider value={OpenBarProviderValue}>
      {children}
    </OpenBarContext.Provider>
  );
};

export const useOpenBar = () => useContext(OpenBarContext);
