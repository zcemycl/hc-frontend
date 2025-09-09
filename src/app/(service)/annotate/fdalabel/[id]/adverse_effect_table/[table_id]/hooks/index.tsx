import { useTickableTableCell } from "@/hooks";
import { IAdverseEffectTable, IQuestionTemplate } from "@/types";
import { useEffect, useState } from "react";

export const useTableCache = ({
  questions,
}: {
  questions: IQuestionTemplate[];
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

  const storeCache = async () => {
    let tmp = { ...finalResults };
    tmp[questions[questionIdx].identifier] = isCellSelected;
    let addtmp = { ...tmp?.additionalRequire! };
    if (
      questions?.[questionIdx] &&
      "additionalRequire" in questions[questionIdx] &&
      "dropdown" in questions[questionIdx].additionalRequire!
    ) {
      const dropdown = questions[questionIdx].additionalRequire.dropdown!;
      addtmp[questions[questionIdx].identifier] = {
        [dropdown.identifier]: selectedOption,
      };
    }
    tmp["additionalRequire"] = addtmp;
    return tmp;
  };

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
        const dropdown = questions[questionIdx].additionalRequire.dropdown!;
        const dropdownkey = dropdown.identifier;
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
      const dropdown = questions[questionIdx].additionalRequire.dropdown!;
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
  };
};
