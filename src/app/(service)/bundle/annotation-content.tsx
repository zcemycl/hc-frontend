"use client";
import { useEffect, useMemo, useState } from "react";
import WordCloud from "./WordCloud";
import {
  AnnotationCategoryEnum,
  IAdverseEffectTable,
  IAnnotationSource,
  IAnnotationSourceMap,
  IBundle,
} from "@/types";
import { PaginationBar2, Table } from "@/components";

const tabOptions = [
  {
    key: "raw",
    displayName: "Raw Data",
  },
  {
    key: "word",
    displayName: "Word Bubble",
  },
  {
    key: "training",
    displayName: "Training",
  },
  {
    key: "audit",
    displayName: "Performance Auditing",
  },
];

const AnnotationContent = ({
  allWords,
  annSource,
  bundle,
}: {
  allWords: string;
  annSource: IAnnotationSourceMap;
  bundle: IBundle | null;
}) => {
  const [tabName, setTabName] = useState("raw");
  const adverse_effect_tables = useMemo<IAnnotationSource[]>(() => {
    if (bundle === null) return [];
    const aet_: IAnnotationSource[] = [];
    bundle.annotations.forEach((a) => {
      if (a.category !== AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE) return;
      if (a.id in annSource) {
        aet_.push(annSource[a.id] as IAnnotationSource);
      }
    });
    console.log(aet_);
    return aet_;
  }, [annSource, bundle]);
  const count_adverse_effect_tables = useMemo(() => {
    return adverse_effect_tables.length;
  }, [adverse_effect_tables]);
  const [artPageN, setArtPageN] = useState(0);

  useEffect(() => {
    setArtPageN(0);
  }, [bundle]);

  return (
    <div className="flex flex-col gap-2">
      <div
        id="tab-bar-bundle-annotation"
        className="rounded-full p-1 bg-gray-400
                    flex flex-row gap-2"
      >
        {tabOptions.map((topt) => {
          return (
            <button
              key={topt.key}
              className={`rounded-full
                                text-black basis-full
                                ${
                                  topt.key === tabName
                                    ? "bg-white font-semibold"
                                    : "bg-gray-400"
                                }`}
              onClick={(e) => {
                e.preventDefault();
                setTabName(topt.key);
              }}
            >
              {topt.displayName}
            </button>
          );
        })}
      </div>
      {tabName === "raw" && (
        <div className="flex flex-col gap-2">
          <div className="content-start w-fit">
            <PaginationBar2
              {...{
                topN: count_adverse_effect_tables,
                pageN: artPageN,
                nPerPage: 1,
                setPageN: setArtPageN,
                maxVisible: 10,
              }}
            />
          </div>
          <div>
            {`${adverse_effect_tables[artPageN]?.fdalabel.tradename} 
                        - ${adverse_effect_tables[artPageN]?.category}
                        - ${adverse_effect_tables[artPageN]?.relative_id}`}
          </div>
          {adverse_effect_tables[artPageN]?.adverse_effect_table !==
            undefined && (
            <Table
              {...{
                ...(adverse_effect_tables[artPageN]
                  ?.adverse_effect_table as IAdverseEffectTable),
                keyname: "table",
                hasCopyBtn: false,
              }}
            />
          )}
        </div>
      )}
      {tabName === "word" && <WordCloud text={allWords} />}
    </div>
  );
};

export { AnnotationContent };
