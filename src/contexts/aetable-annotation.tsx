"use client";
import React, {
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { AnnotationTypeEnum } from "@/constants";

interface AETableAnnotationContextType {
  tabName: AnnotationTypeEnum;
  setTabName: Dispatch<SetStateAction<AnnotationTypeEnum>>;
  ongoingPageN: number;
  setOngoingPageN: Dispatch<SetStateAction<number>>;
  completePageN: number;
  setCompletePageN: Dispatch<SetStateAction<number>>;
  aiPageN: number;
  setAIPageN: Dispatch<SetStateAction<number>>;
  pageN: number;
  setPageN: Dispatch<SetStateAction<number>>;
  saveAETableAnnotationPageCache: () => void;
}

export const AETableAnnotationContext =
  createContext<AETableAnnotationContextType>({
    tabName: AnnotationTypeEnum.ONGOING,
    setTabName: function (
      value: React.SetStateAction<AnnotationTypeEnum>,
    ): void {
      throw new Error("Function not implemented.");
    },
    ongoingPageN: 0,
    setOngoingPageN: function (value: React.SetStateAction<number>): void {
      throw new Error("Function not implemented.");
    },
    completePageN: 0,
    setCompletePageN: function (value: React.SetStateAction<number>): void {
      throw new Error("Function not implemented.");
    },
    aiPageN: 0,
    setAIPageN: function (value: React.SetStateAction<number>): void {
      throw new Error("Function not implemented.");
    },
    pageN: 0,
    setPageN: function (value: React.SetStateAction<number>): void {
      throw new Error("Function not implemented.");
    },
    saveAETableAnnotationPageCache: () => {},
  });

export const AETableAnnotationProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const cache =
    JSON.parse(localStorage.getItem("aeTableAnnotationPageCache") as string) ??
    {};
  const [tabName, setTabName] = useState(
    "tabName" in cache ? cache["tabName"] : AnnotationTypeEnum.ONGOING,
  );
  const [ongoingPageN, setOngoingPageN] = useState(
    "ongoingPageN" in cache ? cache["ongoingPageN"] : 0,
  );
  const [completePageN, setCompletePageN] = useState(
    "completePageN" in cache && cache["tabName"] ? cache["completePageN"] : 0,
  );
  const [aiPageN, setAIPageN] = useState(
    "aiPageN" in cache ? cache["aiPageN"] : 0,
  );
  const [pageN, setPageN] = useState("pageN" in cache ? cache["pageN"] : 0);

  const saveAETableAnnotationPageCache = () => {
    localStorage.setItem(
      "aeTableAnnotationPageCache",
      JSON.stringify({
        tabName: tabName,
        ongoingPageN: ongoingPageN,
        completePageN: completePageN,
        aiPageN: aiPageN,
        pageN: pageN,
      }),
    );
  };

  useEffect(() => {
    if (tabName === AnnotationTypeEnum.AI) {
      setAIPageN(pageN);
    }
    if (tabName === AnnotationTypeEnum.COMPLETE) {
      setCompletePageN(pageN);
    }
    if (tabName === AnnotationTypeEnum.ONGOING) {
      setOngoingPageN(pageN);
    }
  }, [pageN]);

  useEffect(() => {
    if (tabName === AnnotationTypeEnum.AI) {
      setPageN(aiPageN);
    }
    if (tabName === AnnotationTypeEnum.COMPLETE) {
      setPageN(completePageN);
    }
    if (tabName === AnnotationTypeEnum.ONGOING) {
      setPageN(ongoingPageN);
    }
  }, [tabName]);

  const AETableAnnotationProviderValue =
    useMemo<AETableAnnotationContextType>(() => {
      return {
        tabName,
        setTabName,
        ongoingPageN,
        setOngoingPageN,
        completePageN,
        setCompletePageN,
        aiPageN,
        setAIPageN,
        pageN,
        setPageN,
        saveAETableAnnotationPageCache,
      };
    }, [
      tabName,
      setTabName,
      ongoingPageN,
      setOngoingPageN,
      completePageN,
      setCompletePageN,
      aiPageN,
      setAIPageN,
      pageN,
      setPageN,
      saveAETableAnnotationPageCache,
    ]);
  return (
    <AETableAnnotationContext.Provider value={AETableAnnotationProviderValue}>
      {children}
    </AETableAnnotationContext.Provider>
  );
};

export const useAETableAnnotation = () => useContext(AETableAnnotationContext);
