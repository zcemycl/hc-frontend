import { useTickableTableCell } from "@/hooks";
import { IAdverseEffectTable, IQuestionTemplate } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useTableCache = ({
  questions,
  tab,
}: {
  questions: IQuestionTemplate[];
  tab: string;
}) => {
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

  const filterQuestions = useMemo(() => {
    if (tab !== "ai") return questions;
    const tmp = questions.filter((q) =>
      Object.keys(finalResults).includes(q.identifier),
    );
    return tmp;
  }, [finalResults]);

  const storeCache = useCallback(async () => {
    let tmp = { ...finalResults };
    tmp[filterQuestions[questionIdx].identifier] = isCellSelected;
    let addtmp = { ...tmp?.additionalRequire! };
    if (
      filterQuestions?.[questionIdx] &&
      "additionalRequire" in filterQuestions[questionIdx] &&
      "dropdown" in filterQuestions[questionIdx].additionalRequire!
    ) {
      const dropdown = filterQuestions[questionIdx].additionalRequire.dropdown!;
      addtmp[filterQuestions[questionIdx].identifier] = {
        [dropdown.identifier]: selectedOption,
      };
    }
    tmp["additionalRequire"] = addtmp;
    return tmp;
  }, [
    questionIdx,
    filterQuestions,
    finalResults,
    isCellSelected,
    selectedOption,
  ]);

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
    if (
      filterQuestions[questionIdx] &&
      filterQuestions[questionIdx].identifier in finalResults
    ) {
      const questionIdf = filterQuestions[questionIdx].identifier;
      setIsCellSelected(finalResults[questionIdf]);
      isCacheSelected =
        "additionalRequire" in finalResults &&
        questionIdf in finalResults.additionalRequire!;
      if (isCacheSelected) {
        const dropdown =
          filterQuestions[questionIdx].additionalRequire.dropdown!;
        const dropdownkey = dropdown.identifier;
        console.log(finalResults.additionalRequire![questionIdf][dropdownkey]);
        setSelectedOption(
          finalResults.additionalRequire![questionIdf][dropdownkey],
        );
      }
    }
    // get default from question
    if (
      filterQuestions?.[questionIdx] &&
      "additionalRequire" in filterQuestions[questionIdx] &&
      "dropdown" in filterQuestions[questionIdx].additionalRequire! &&
      !isCacheSelected
    ) {
      const dropdown = filterQuestions[questionIdx].additionalRequire.dropdown!;
      const newDefaultOption = dropdown.defaultOption;
      setSelectedOption(newDefaultOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIdx, finalResults]);

  return {
    storeCache,
    questionIdx,
    setQuestionIdx,
    tableData,
    setTableData,
    isCellSelected,
    setIsCellSelected,
    finalResults,
    setFinalResults,
    selectedOption,
    setSelectedOption,
    resetCellSelected,
    filterQuestions,
  };
};
