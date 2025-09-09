"use client";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import { useEffect, useContext } from "react";
import {
  fetchAETableByIdsv2,
  fetchAnnotatedTableMapByNameIdsv2,
} from "@/http/backend";
import {
  AnnotationCategoryEnum,
  IAdverseEffectTable,
  IQuestionTemplate,
} from "@/types";
import { Spinner, ProtectedRoute, BackBtn, PaginationBar2 } from "@/components";
import { questions } from "../questions";
import { useApiHandler } from "@/hooks";
import { AnnotateDropdown, AnnotateTable } from "../components";
import { PageProps } from "../props";
import { useTableCache } from "../hooks";

export default function Page({ params }: Readonly<PageProps>) {
  const { handleResponse } = useApiHandler();
  const { isLoadingAuth } = useAuth();
  const { isLoadingv2, withLoading } = useLoader();
  const { versions } = useContext(FdaVersionsContext);

  const {
    questionIdx,
    setQuestionIdx,
    tableData,
    setTableData,
    isCellSelected,
    setIsCellSelected,
    setFinalResults,
    selectedOption,
    setSelectedOption,
    resetCellSelected,
    filterQuestions: filterQuestionsWithAnswers,
  } = useTableCache({ questions: questions as IQuestionTemplate[], tab: "ai" });

  // set table
  useEffect(() => {
    async function getData() {
      const res = await withLoading(() =>
        fetchAETableByIdsv2(
          params.table_id,
          AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
          params.id,
          versions,
        ),
      );
      console.log(res);
      handleResponse(res);
      if (res.success) setTableData(res.data);
      const res_history = await withLoading(() =>
        fetchAnnotatedTableMapByNameIdsv2(
          res.data?.id,
          AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
          true,
          versions,
        ),
      );
      console.log(res_history);
      handleResponse(res_history);
      if (res_history.success)
        setFinalResults(res_history.data?.annotated ?? {});
    }
    if (isLoadingAuth) return;
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font h-[81vh] sm:h-[89vh]
        overflow-y-scroll overflow-x-auto ${isLoadingv2 ? "animate-pulse" : ""}`}
      >
        <div className="flex flex-col justify-center content-center items-center mt-[7rem]">
          {isLoadingv2 && (
            <div
              className="absolute left-1/2 top-1/2 
              -translate-x-1/2 -translate-y-1/2"
            >
              <Spinner />
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <div
            className="flex flex-col mt-8 
            sm:w-2/3 w-screen
            p-10 space-y-2"
          >
            <div className="flex justify-between">
              <h2 className="text-white text-lg mb-1 font-medium title-font">
                AE Table Annotation (AI)
              </h2>
              <BackBtn />
            </div>
            <p className="leading-relaxed w-full">
              A.E Table {params.table_id} from label {params.id}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                {/* slidebar */}
                <PaginationBar2
                  {...{
                    topN: filterQuestionsWithAnswers.length,
                    pageN: questionIdx,
                    nPerPage: 1,
                    setPageN: async (i) => {
                      setIsCellSelected(structuredClone(resetCellSelected));
                      setSelectedOption("");
                      setQuestionIdx(i);
                    },
                  }}
                />
              </div>
            </div>
            <caption className="text-left">{tableData?.caption}</caption>
            <p className="leading-none w-full text-white">
              {filterQuestionsWithAnswers[questionIdx]?.displayName}
            </p>
            <AnnotateDropdown
              {...{
                questions: filterQuestionsWithAnswers as IQuestionTemplate[],
                questionIdx,
                selectedOption,
                setSelectedOption,
                isEnabled: false,
              }}
            />
            <AnnotateTable
              {...{
                tableData: tableData as IAdverseEffectTable,
                mapMode: "none",
                isCellSelected,
                setIsCellSelected,
              }}
            />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
