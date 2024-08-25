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

interface IAePageCache {
  tabName?: AnnotationTypeEnum;
  ongoingPageN?: number;
  completePageN?: number;
  aiPageN?: number;
  pageN?: number;
}

interface AETableAnnotationContextType {
  aePageCache: IAePageCache;
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
  saveAETableAnnotationPageCache: (
    newTabName?: AnnotationTypeEnum | null,
    newPageN?: number | null,
  ) => void;
  saveTabPage: (i: number) => void;
}

export const AETableAnnotationContext =
  createContext<AETableAnnotationContextType>({
    aePageCache: {},
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
    saveAETableAnnotationPageCache: (
      newTabName?: AnnotationTypeEnum | null,
      newPageN?: number | null,
    ) => {},
    saveTabPage: (i: number) => {},
  });

export const AETableAnnotationProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  // const cache =
  //   JSON.parse(localStorage.getItem("aeTableAnnotationPageCache") as string) ??
  //   {};
  const [cache, setCache] = useState({});
  const [tabName, setTabName] = useState(
    ("tabName" in cache
      ? cache["tabName"]
      : AnnotationTypeEnum.ONGOING) as AnnotationTypeEnum,
  );
  const [ongoingPageN, setOngoingPageN] = useState(
    ("pageN" in cache ? cache["pageN"] : 0) as number,
  );
  const [completePageN, setCompletePageN] = useState(
    ("pageN" in cache ? cache["pageN"] : 0) as number,
  );
  const [aiPageN, setAIPageN] = useState(
    ("pageN" in cache ? cache["pageN"] : 0) as number,
  );
  const [pageN, setPageN] = useState(
    ("pageN" in cache ? cache["pageN"] : 0) as number,
  );

  const saveAETableAnnotationPageCache = (
    newTabName: AnnotationTypeEnum | null = null,
    newPageN: number | null = null,
    // newOngoing
  ) => {
    let tabName_ = newTabName === null ? tabName : newTabName;
    let pageN_ = newPageN === null ? pageN : newPageN;
    let ongoingPageN_ = ongoingPageN;
    let aiPageN_ = aiPageN;
    let completePageN_ = completePageN;
    if (tabName_ === AnnotationTypeEnum.AI) {
      aiPageN_ = newPageN === null ? aiPageN : newPageN;
    }
    if (tabName_ === AnnotationTypeEnum.COMPLETE) {
      completePageN_ = newPageN === null ? completePageN : newPageN;
    }
    if (tabName_ === AnnotationTypeEnum.ONGOING) {
      ongoingPageN_ = newPageN === null ? ongoingPageN : newPageN;
    }
    const saveItems = {
      tabName: tabName_,
      ongoingPageN: ongoingPageN_,
      completePageN: completePageN_,
      aiPageN: aiPageN_,
      pageN: pageN,
    };
    localStorage.setItem(
      "aeTableAnnotationPageCache",
      JSON.stringify(saveItems),
    );
  };

  const saveTabPage = (i: number) => {
    if (tabName === AnnotationTypeEnum.AI) {
      setAIPageN(i);
    }
    if (tabName === AnnotationTypeEnum.COMPLETE) {
      setCompletePageN(i);
    }
    if (tabName === AnnotationTypeEnum.ONGOING) {
      setOngoingPageN(i);
    }
    setPageN(i);
  };

  useEffect(() => {
    const tmpCache = JSON.parse(
      localStorage.getItem("aeTableAnnotationPageCache") as string,
    );
    // console.log(tmpCache["pageN"]);
    if (tmpCache !== null) {
      setCache(tmpCache);
      if ("tabName" in tmpCache) {
        setTabName(tmpCache["tabName"] as AnnotationTypeEnum);
        if (
          tmpCache["tabName"] === AnnotationTypeEnum.AI &&
          "aiPageN" in tmpCache
        ) {
          setPageN(tmpCache["aiPageN"] as number);
        }
        if (
          tmpCache["tabName"] === AnnotationTypeEnum.COMPLETE &&
          "completePageN" in tmpCache
        ) {
          setPageN(tmpCache["completePageN"] as number);
        }
        if (
          tmpCache["tabName"] === AnnotationTypeEnum.ONGOING &&
          "ongoingPageN" in tmpCache
        ) {
          setPageN(tmpCache["ongoingPageN"] as number);
        }
      }

      // if ("pageN" in tmpCache)
      //   setPageN(tmpCache["pageN"] as number);
      if ("ongoingPageN" in tmpCache)
        setOngoingPageN(tmpCache["ongoingPageN"] as number);
      if ("completePageN" in tmpCache)
        setCompletePageN(tmpCache["completePageN"] as number);
      if ("ongoingPageN" in tmpCache) setAIPageN(tmpCache["aiPageN"] as number);
      console.log(tmpCache);
    }
  }, []);

  const AETableAnnotationProviderValue =
    useMemo<AETableAnnotationContextType>(() => {
      return {
        aePageCache: cache,
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
        saveTabPage,
      };
    }, [
      cache,
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
      saveTabPage,
    ]);
  return (
    <AETableAnnotationContext.Provider value={AETableAnnotationProviderValue}>
      {children}
    </AETableAnnotationContext.Provider>
  );
};

export const useAETableAnnotation = () => useContext(AETableAnnotationContext);
