"use client";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useContext } from "react";
import {
  fetchAETableByIdsv2,
  addAnnotationByNameIdv2,
  fetchAnnotatedTableMapByNameIdsv2,
} from "@/http/backend";
import {
  AnnotationCategoryEnum,
  IAdverseEffectTable,
  IQuestionTemplate,
} from "@/types";
import { Spinner, ProtectedRoute, BackBtn } from "@/components";
import { questions } from "./questions";
import { AnnotationTypeEnum } from "@/constants";
import { useApiHandler } from "@/hooks";
import {
  AnnotateDropdown,
  AnnotateProgressBar,
  AnnotateTable,
} from "./components";
import { PageProps } from "./props";
import { useTableCache } from "./hooks";

export default function Page({ params }: Readonly<PageProps>) {
  const { handleResponse } = useApiHandler();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.has("tab")
    ? searchParams.get("tab")
    : AnnotationTypeEnum.ONGOING;
  const { isLoadingAuth } = useAuth();
  const { isLoadingv2, withLoading } = useLoader();
  const { versions } = useContext(FdaVersionsContext);
  const {
    storeCache,
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
  } = useTableCache({
    questions: questions as IQuestionTemplate[],
    tab: tab as string,
  });

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
      handleResponse(res);
      if (res.success) setTableData(res.data);
      console.log(versions);
      if (tab !== AnnotationTypeEnum.ONGOING) {
        const res_history = await withLoading(() =>
          fetchAnnotatedTableMapByNameIdsv2(
            res.data?.id!,
            AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
            tab === AnnotationTypeEnum.AI,
            versions,
          ),
        );
        handleResponse(res_history);
        if (res_history.success)
          setFinalResults(res_history.data?.annotated ?? {});
      }
    }
    if (isLoadingAuth) return;
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font h-[81vh] sm:h-[89vh]
        overflow-y-scroll overflow-x-hidden ${isLoadingv2 ? "animate-pulse" : ""}`}
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
                AE Table Annotation
              </h2>
              <BackBtn />
            </div>
            <p className="leading-relaxed w-full">
              A.E Table {params.table_id} from label {params.id}
            </p>
            <div className="flex justify-between items-center">
              <AnnotateProgressBar
                {...{
                  questions: filterQuestionsWithAnswers as IQuestionTemplate[],
                  pageN: questionIdx,
                  setPageN: async (i) => {
                    if (tab !== "ai") {
                      const tmp = await withLoading(() => storeCache());
                      setFinalResults(tmp);
                    }
                    setIsCellSelected(structuredClone(resetCellSelected));
                    setSelectedOption("");
                    setQuestionIdx(i);
                  },
                  submit_callback:
                    tab !== "ai"
                      ? async () => {
                          const tmp = await withLoading(() => storeCache());
                          setFinalResults(tmp);
                          console.log(tmp);
                          const addres = await withLoading(() =>
                            addAnnotationByNameIdv2(
                              tableData?.id!,
                              AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
                              tmp,
                            ),
                          );
                          handleResponse(addres);
                          if (addres.success) {
                            router.back();
                          }
                        }
                      : undefined,
                }}
              />
            </div>
            <caption className="text-left">{tableData?.caption}</caption>
            <p className="leading-none w-full text-white">
              {questions[questionIdx].displayName}
            </p>
            <AnnotateDropdown
              {...{
                questions: filterQuestionsWithAnswers as IQuestionTemplate[],
                questionIdx,
                selectedOption,
                setSelectedOption,
                isEnabled: tab !== "ai",
              }}
            />
            <AnnotateTable
              {...{
                tableData: tableData as IAdverseEffectTable,
                mapMode: tab !== "ai" ? questions[questionIdx].mapMode : "none",
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
