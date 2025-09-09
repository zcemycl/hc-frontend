"use client";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
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
import { useApiHandler, useTickableTableCell } from "@/hooks";
import {
  AnnotateDropdown,
  AnnotateProgressBar,
  AnnotateTable,
} from "./components";
import { PageProps } from "./props";

export default function Page({ params }: Readonly<PageProps>) {
  const { handleResponse } = useApiHandler();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.has("tab")
    ? searchParams.get("tab")
    : AnnotationTypeEnum.ONGOING;
  const { isLoadingAuth } = useAuth();
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

  const storeCache = async () => {
    let tmp = { ...finalResults };
    tmp[questions[questionIdx].identifier] = isCellSelected;
    let addtmp = { ...tmp?.additionalRequire! };
    if (
      "additionalRequire" in questions[questionIdx] &&
      "dropdown" in questions[questionIdx].additionalRequire!
    ) {
      addtmp[questions[questionIdx].identifier] = {
        [questions[questionIdx].additionalRequire!.dropdown.identifier]:
          selectedOption,
      };
    }
    tmp["additionalRequire"] = addtmp;
    return tmp;
  };

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
    if (questions[questionIdx].identifier in finalResults) {
      setIsCellSelected(finalResults[questions[questionIdx].identifier]);
      const questionIdf = questions[questionIdx].identifier;
      isCacheSelected =
        "additionalRequire" in finalResults &&
        questionIdf in finalResults.additionalRequire!;
      if (isCacheSelected) {
        const dropdownkey =
          questions[questionIdx].additionalRequire!.dropdown.identifier;
        console.log(finalResults.additionalRequire![questionIdf][dropdownkey]);
        setSelectedOption(
          finalResults.additionalRequire![questionIdf][dropdownkey],
        );
      }
    }
    // get default from question
    if (
      "additionalRequire" in questions[questionIdx] &&
      "dropdown" in questions[questionIdx].additionalRequire! &&
      !isCacheSelected
    ) {
      const newDefaultOption =
        questions[questionIdx].additionalRequire!.dropdown.defaultOption;
      setSelectedOption(newDefaultOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIdx, finalResults]);

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
                  questions: questions as IQuestionTemplate[],
                  questionIdx,
                  pageN: questionIdx,
                  setPageN: async (i) => {
                    const tmp = await withLoading(() => storeCache());
                    setFinalResults(tmp);
                    setIsCellSelected(structuredClone(resetCellSelected));
                    setSelectedOption("");
                    setQuestionIdx(i);
                  },
                  submit_callback: async () => {
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
                  },
                }}
              />
            </div>
            <caption className="text-left">{tableData?.caption}</caption>
            <p className="leading-none w-full text-white">
              {questions[questionIdx].displayName}
            </p>
            <AnnotateDropdown
              {...{
                questions: questions as IQuestionTemplate[],
                questionIdx,
                selectedOption,
                setSelectedOption,
              }}
            />
            <AnnotateTable
              {...{
                tableData: tableData as IAdverseEffectTable,
                mapMode: questions[questionIdx].mapMode,
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
