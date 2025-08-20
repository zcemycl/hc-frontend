"use client";
import {
  Table,
  ExpandableBtn,
  TypographyH2,
  ProtectedRoute,
  BackBtn,
  VerToolbar,
} from "@/components";
import { AnnotationTypeEnum } from "@/constants";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import { fetchAETableBySetid } from "@/http/backend";
import { GoIcon } from "@/icons";
import {
  AnnotationCategoryEnum,
  IAdverseEffectTable,
  IBaseTable,
  IClinicalTrialTable,
} from "@/types";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext, useCallback } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { credentials, isLoadingAuth } = useAuth();
  const { isLoadingv2, withLoading } = useLoader();
  const [tableData, setTableData] = useState<IAdverseEffectTable[]>([]);
  const [ctTableData, setCtTableData] = useState<IClinicalTrialTable[]>([]);
  const { versions } = useContext(FdaVersionsContext);

  const getData = useCallback(async () => {
    const [res, res2] = await withLoading(() =>
      Promise.all([
        fetchAETableBySetid(
          params.id,
          AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
          versions,
        ),
        fetchAETableBySetid(
          params.id,
          AnnotationCategoryEnum.CLINICAL_TRIAL_TABLE,
          versions,
        ),
      ]),
    );
    setTableData(res);
    setCtTableData(res2);
  }, [versions]);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (credentials.length === 0) return;
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font h-[81vh] sm:h-[89vh]
        overflow-y-scroll overflow-x-hidden ${isLoadingv2 ? "animate-pulse" : ""}`}
      >
        <div
          className="px-2 py-24 flex flex-col justify-center items-center align-center
        "
        >
          <div
            className="sm:w-1/2 flex flex-col mt-8 
              w-full px-1 pt-5 space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center space-x-1">
                <TypographyH2>Annotation Label {params.id}</TypographyH2>
              </div>
              <BackBtn />
            </div>
            <VerToolbar
              fdaSections={[
                "fdalabel",
                "adverse_effect_table",
                "clinical_trial_table",
              ]}
              reloadCallback={async () => {
                await withLoading(() => getData());
              }}
            />
            <TypographyH2>Adverse Effect Tables</TypographyH2>
          </div>
          <div className="sm:w-1/2 flex flex-col w-full px-1 space-y-2">
            {tableData.map((data, idx) => {
              return (
                <ExpandableBtn
                  key={`${params.id}-${idx}`}
                  refkey={`${params.id}-${idx}`}
                  onClick={(e) => {
                    e.preventDefault();
                    let redirectUrl = `/annotate/fdalabel/${params.id}/adverse_effect_table/${idx + 1}`;
                    const urlparams = new URLSearchParams();
                    urlparams.append("tab", AnnotationTypeEnum.COMPLETE);
                    redirectUrl = `${redirectUrl}?${urlparams}`;
                    router.push(redirectUrl);
                  }}
                  childrenLong={
                    <Table
                      {...{
                        content: {
                          table: data.content.table.slice(0, 6),
                        } as IBaseTable,
                        keyname: "table",
                      }}
                    />
                  }
                >
                  <>
                    <p className="leading-relaxed w-full">[Table {idx + 1}]</p>
                    <div
                      className={`transition-all duration-300
                      overflow-hidden
                      max-w-0
                      group-hover:max-w-full
                      `}
                    >
                      <GoIcon />
                    </div>
                  </>
                </ExpandableBtn>
              );
            })}
          </div>
          {ctTableData.length !== 0 && (
            <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-1 space-y-2">
              <TypographyH2>Clinical Trial Tables</TypographyH2>
            </div>
          )}
          <div className="sm:w-1/2 flex flex-col w-full px-1 space-y-2">
            {ctTableData.map((data, idx) => {
              return (
                <ExpandableBtn
                  key={`${params.id}-${idx}`}
                  refkey={`${params.id}-${idx}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const urlparams = new URLSearchParams();
                    urlparams.append("tab", AnnotationTypeEnum.COMPLETE);
                    let redirectUrl = `/annotate/fdalabel/${params.id}/clinical_trial_table/${idx + 1}`;
                    redirectUrl = `${redirectUrl}?${urlparams}`;
                    router.push(redirectUrl);
                  }}
                  childrenLong={
                    <Table
                      {...{
                        content: {
                          table: data.content.table.slice(0, 6),
                        } as IBaseTable,
                        keyname: "table",
                      }}
                    />
                  }
                >
                  <>
                    <p className="leading-relaxed w-full">[Table {idx + 1}]</p>
                    <div
                      className={`transition-all duration-300
                      overflow-hidden
                      max-w-0
                      group-hover:max-w-full
                      `}
                    >
                      <GoIcon />
                    </div>
                  </>
                </ExpandableBtn>
              );
            })}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
