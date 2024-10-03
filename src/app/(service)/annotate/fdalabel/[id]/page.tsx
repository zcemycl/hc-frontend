"use client";
import { Table, ExpandableBtn, TypographyH2 } from "@/components";
import { ProtectedRoute, useAuth } from "@/contexts";
import { fetchAETableBySetid } from "@/http/backend";
import { GoIcon } from "@/icons";
import {
  AnnotationCategoryEnum,
  IAdverseEffectTable,
  IBaseTable,
  IClinicalTrialTable,
} from "@/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { credentials, isLoadingAuth } = useAuth();
  const [tableData, setTableData] = useState<IAdverseEffectTable[]>([]);
  const [ctTableData, setCtTableData] = useState<IClinicalTrialTable[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [ctHoverIdx, setCtHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    async function getData() {
      const res = await fetchAETableBySetid(
        params.id,
        AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
      );
      setTableData(res);
      const res2 = await fetchAETableBySetid(
        params.id,
        AnnotationCategoryEnum.CLINICAL_TRIAL_TABLE,
      );
      setCtTableData(res2);
    }
    if (isLoadingAuth) return;
    if (credentials.length === 0) return;
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

  return (
    <ProtectedRoute>
      <section
        className="text-gray-400 bg-gray-900 body-font h-[83vh] 
        sm:h-[90vh] overflow-y-scroll"
      >
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
        "
        >
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-1 pt-5 pb-5 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center space-x-1">
                <TypographyH2>Annotation Label {params.id}</TypographyH2>
              </div>
              <button
                onClick={() => {
                  router.back();
                }}
                className="bg-purple-700 rounded p-2 
                text-white hover:bg-purple-800"
              >
                Back
              </button>
            </div>
            <TypographyH2>Adverse Effect Tables</TypographyH2>
          </div>
          {tableData.map((data, idx) => {
            return (
              <ExpandableBtn
                key={`${params.id}-${idx}`}
                refkey={`${params.id}-${idx}`}
                hoverCondition={hoverIdx === idx}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    `/annotate/fdalabel/${params.id}/adverse_effect_table/${idx + 1}`,
                  );
                }}
                onMouseOver={(e) => {
                  setHoverIdx(idx);
                }}
                childrenLong={
                  <Table
                    {...{
                      content: {
                        table: data.content.table.slice(0, 6),
                      } as IBaseTable,
                    }}
                  />
                }
              >
                <>
                  <p className="leading-relaxed w-full">[Table {idx + 1}]</p>
                  <div
                    className={`transition duration-300
                    ${hoverIdx == idx ? "opacity-1 translate-x-0" : "opacity-0 -translate-x-1/2"}`}
                  >
                    <GoIcon />
                  </div>
                </>
              </ExpandableBtn>
            );
          })}
          {ctTableData.length !== 0 && (
            <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-1 pt-5 pb-5 space-y-2">
              <TypographyH2>Clinical Trial Tables</TypographyH2>
            </div>
          )}
          {ctTableData.map((data, idx) => {
            return (
              <ExpandableBtn
                key={`${params.id}-${idx}`}
                refkey={`${params.id}-${idx}`}
                hoverCondition={ctHoverIdx === idx}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    `/annotate/fdalabel/${params.id}/clinical_trial_table/${idx + 1}`,
                  );
                }}
                onMouseOver={(e) => {
                  setCtHoverIdx(idx);
                }}
                childrenLong={
                  <Table
                    {...{
                      content: {
                        table: data.content.table.slice(0, 6),
                      } as IBaseTable,
                    }}
                  />
                }
              >
                <>
                  <p className="leading-relaxed w-full">[Table {idx + 1}]</p>
                  <div
                    className={`transition duration-300
                    ${hoverIdx == idx ? "opacity-1 translate-x-0" : "opacity-0 -translate-x-1/2"}`}
                  >
                    <GoIcon />
                  </div>
                </>
              </ExpandableBtn>
            );
          })}
        </div>
      </section>
    </ProtectedRoute>
  );
}
