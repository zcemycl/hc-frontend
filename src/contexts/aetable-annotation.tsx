"use client";
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { AnnotationTypeEnum } from "@/constants";
import {
  DummySetStateFactory,
  numberDummySetState,
  TDummySetState,
  TNumberDummySetState,
} from "@/types";

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
  setTabName: TDummySetState<AnnotationTypeEnum>;
  ongoingPageN: number;
  setOngoingPageN: TNumberDummySetState;
  completePageN: number;
  setCompletePageN: TNumberDummySetState;
  aiPageN: number;
  setAIPageN: TNumberDummySetState;
  pageN: number;
  setPageN: TNumberDummySetState;
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
    setTabName: DummySetStateFactory<AnnotationTypeEnum>(),
    ongoingPageN: 0,
    setOngoingPageN: numberDummySetState,
    completePageN: 0,
    setCompletePageN: numberDummySetState,
    aiPageN: 0,
    setAIPageN: numberDummySetState,
    pageN: 0,
    setPageN: numberDummySetState,
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
          console.log(aiPageN_);
          pageN_ = aiPageN_;
        }
        if (tabName_ === AnnotationTypeEnum.COMPLETE) {
          completePageN_ = newPageN === null ? completePageN : newPageN;
          pageN_ = completePageN_;
        }
        if (tabName_ === AnnotationTypeEnum.ONGOING) {
          ongoingPageN_ = newPageN === null ? ongoingPageN : newPageN;
          pageN_ = ongoingPageN_;
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
    ]);
  return (
    <AETableAnnotationContext.Provider value={AETableAnnotationProviderValue}>
      {children}
    </AETableAnnotationContext.Provider>
  );
};

export const useAETableAnnotation = () => useContext(AETableAnnotationContext);
