"use client";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import { useState, useEffect, useContext, useMemo } from "react";
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
import { useApiHandler, useTickableTableCell } from "@/hooks";
import { AnnotateDropdown, AnnotateTable } from "../components";
import { PageProps } from "../props";

export default function Page({ params }: Readonly<PageProps>) {
  const { handleResponse } = useApiHandler();
  const { credentials, isLoadingAuth } = useAuth();
  const { isLoadingv2, withLoading } = useLoader();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [tableData, setTableData] = useState<IAdverseEffectTable | null>(null);
  const n_rows = tableData?.content.table.length ?? 0;
  const n_cols = tableData?.content.table[0].length ?? 0;
  const { resetCellSelected } = useTickableTableCell({
    n_rows,
    n_cols,
  });
  const [isCellSelected, setIsCellSelected] = useState<boolean[][]>(
    structuredClone(resetCellSelected),
  );
  const [finalResults, setFinalResults] = useState<{ [key: string]: any }>({});
  const [selectedOption, setSelectedOption] = useState("");
  const { versions } = useContext(FdaVersionsContext);

  const filterQuestionsWithAnswers = useMemo(() => {
    const tmp = questions.filter((q) =>
      Object.keys(finalResults).includes(q.identifier),
    );
    console.log("tmp: ", tmp, questions);
    return tmp;
  }, [finalResults]);

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
    if (credentials.length === 0) return;
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

  // set selected table dimension when table is ready
  useEffect(() => {
    let newSelected = Array.from({ length: n_rows }, () =>
      Array.from({ length: n_cols }, () => false),
    );
    setIsCellSelected(newSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  useEffect(() => {
    // get cache
    let isCacheSelected = false;
    if (filterQuestionsWithAnswers[questionIdx]?.identifier in finalResults) {
      setIsCellSelected(
        finalResults[filterQuestionsWithAnswers[questionIdx].identifier],
      );
      const questionIdf = filterQuestionsWithAnswers[questionIdx].identifier;
      isCacheSelected =
        "additionalRequire" in finalResults &&
        questionIdf in finalResults.additionalRequire!;
      if (isCacheSelected) {
        const dropdownkey =
          filterQuestionsWithAnswers[questionIdx].additionalRequire!.dropdown
            .identifier;
        console.log(finalResults.additionalRequire![questionIdf][dropdownkey]);
        setSelectedOption(
          finalResults.additionalRequire![questionIdf][dropdownkey],
        );
      }
    }
    // get default from question
    if (
      filterQuestionsWithAnswers?.[questionIdx] &&
      "additionalRequire" in filterQuestionsWithAnswers?.[questionIdx] &&
      "dropdown" in
        filterQuestionsWithAnswers[questionIdx].additionalRequire! &&
      !isCacheSelected
    ) {
      const newDefaultOption =
        filterQuestionsWithAnswers[questionIdx].additionalRequire!.dropdown
          .defaultOption;
      setSelectedOption(newDefaultOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIdx, finalResults]);

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
