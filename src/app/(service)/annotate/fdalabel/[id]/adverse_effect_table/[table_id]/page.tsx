"use client";
import { useAuth, useLoader } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Fragment } from "react";
import {
  fetchAETableByIds,
  addAnnotationByNameId,
  fetchAnnotatedTableMapByNameIds,
} from "@/http/backend";
import {
  AnnotationCategoryEnum,
  IAdverseEffectTable,
  IBaseTable,
} from "@/types";
import {
  Table,
  setup_selectable_cell_map,
  DropDownBtn,
  DropDownList,
  setup_selectable_row_map,
  setup_selectable_col_map,
  setup_selectable_none_map,
  switch_map,
  Spinner,
  ProtectedRoute,
} from "@/components";
import { questions } from "./questions";
import { AETableVerEnum, aeTableVersionMap } from "@/constants";

interface PageProps {
  params: {
    id: string;
    table_id: number;
  };
}

export default function Page({ params }: Readonly<PageProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultVersion = searchParams.has("version")
    ? searchParams.get("version")
    : AETableVerEnum.v0_0_1;
  const { credentials, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [tableData, setTableData] = useState<IAdverseEffectTable | null>(null);
  const n_rows = tableData?.content.table.length ?? 0;
  const n_cols = tableData?.content.table[0].length ?? 0;
  const row_map = setup_selectable_row_map(n_rows, n_cols);
  const col_map = setup_selectable_col_map(n_rows, n_cols);
  const cell_map = setup_selectable_cell_map(n_rows, n_cols);
  const none_map = setup_selectable_none_map(n_rows, n_cols);
  const resetCellSelected = Array.from({ length: n_rows }, () =>
    Array.from({ length: n_cols }, () => false),
  );
  const [isCellSelected, setIsCellSelected] =
    useState<boolean[][]>(resetCellSelected);
  const [finalResults, setFinalResults] = useState<{ [key: string]: any }>({});
  const [selectedOption, setSelectedOption] = useState("");
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  const [version, setVersion] = useState(defaultVersion);

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
      const res = await fetchAETableByIds(
        params.table_id,
        AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
        params.id,
        version as AETableVerEnum,
      );
      setTableData(res);
      const res_history = await fetchAnnotatedTableMapByNameIds(
        res.id,
        AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
        false,
        version as AETableVerEnum,
      );
      if ("annotated" in res_history) setFinalResults(res_history["annotated"]);
    }
    if (isLoadingAuth) return;
    if (credentials.length === 0) return;
    setIsLoading(true);
    getData();
    setIsLoading(false);
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
    console.log(finalResults);
  }, [finalResults]);

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
        className={`text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]
        overflow-y-scroll overflow-x-hidden ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          {(isLoading || isLoadingAuth) && (
            <div
              className="absolute left-1/2 top-1/2 
              -translate-x-1/2 -translate-y-1/2"
            >
              <Spinner />
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <div className="sm:w-2/3 flex flex-col mt-8 w-screen p-10 space-y-2">
            <div className="flex justify-between">
              <h2 className="text-white text-lg mb-1 font-medium title-font">
                AE Table Annotation
              </h2>
              <button
                onClick={() => router.back()}
                className="bg-purple-700 rounded p-2 
                text-white hover:bg-purple-800"
              >
                Back
              </button>
            </div>
            <p className="leading-relaxed w-full">
              A.E Table {params.table_id} from label {params.id}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                {/* slidebar */}
                {questions.map((q, idx) => {
                  return (
                    <span
                      className={`relative flex ${questionIdx === idx ? "h-3 w-3" : "h-2 w-2"}`}
                      key={q.displayName}
                      onClick={async () => {
                        const tmp = await storeCache();
                        setFinalResults(tmp);
                        setIsCellSelected(resetCellSelected);
                        setSelectedOption("");
                        setQuestionIdx(idx);
                      }}
                    >
                      <span
                        className={`${questionIdx === idx ? "animate-ping" : ""} absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full 
                          hover:bg-sky-50 bg-sky-500 focus:bg-sky-950
                          ${questionIdx === idx ? "h-3 w-3" : "h-2 w-2"}`}
                      ></span>
                    </span>
                  );
                })}
                <button
                  className={`bg-emerald-500 text-white
                  hover:bg-emerald-300 transition
                  rounded p-2 origin-left
                  ${questionIdx === questions.length - 1 ? "scale-x-100 scale-y-100" : "scale-x-0 scale-y-0"}`}
                  onClick={async () => {
                    const tmp = await storeCache();
                    setFinalResults(tmp);
                    if (credentials.length === 0) return;
                    const _ = await addAnnotationByNameId(
                      tableData?.id!,
                      AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
                      tmp,
                    );
                    router.back();
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
            <caption className="text-left">{tableData?.caption}</caption>
            <p className="leading-none w-full text-white">
              {questions[questionIdx].displayName}
            </p>

            <div
              className={`transition
                origin-top
                ${"additionalRequire" in questions[questionIdx] ? "scale-y-100" : "scale-y-0"}`}
            >
              {"additionalRequire" in questions[questionIdx] && (
                <Fragment>
                  <DropDownBtn
                    extraClassName="justify-end w-full
                  bg-blue-500 hover:bg-blue-700
                  text-black"
                    onClick={() => {
                      setIsOptionDropdownOpen(!isOptionDropdownOpen);
                    }}
                  >
                    {
                      questions[questionIdx].additionalRequire!.dropdown
                        .displayName
                    }
                    :{" "}
                    {
                      questions[
                        questionIdx
                      ].additionalRequire!.dropdown.options.filter(
                        (each) => each.type === selectedOption,
                      )[0]?.displayName
                    }
                  </DropDownBtn>
                  <div className="flex w-full justify-end h-0">
                    <DropDownList
                      selected={selectedOption}
                      displayNameKey="displayName"
                      selectionKey="type"
                      allOptions={
                        questions[questionIdx].additionalRequire!.dropdown
                          .options
                      }
                      isOpen={isOptionDropdownOpen}
                      setSelectionKey={(s) => {
                        setSelectedOption(s);
                      }}
                      resetCallback={() => {
                        setIsOptionDropdownOpen(false);
                        // setAddUserInfo((prev) => ({...prev, role: UserRoleEnum.USER}))
                      }}
                    />
                  </div>
                </Fragment>
              )}
            </div>

            <div className="overflow-x-auto flex flex-col w-full">
              {tableData && (
                <Table
                  {...{
                    content: {
                      table: tableData.content.table,
                    } as IBaseTable,
                    keyname: "table",
                    isSelectable: {
                      table: switch_map(
                        row_map,
                        cell_map,
                        col_map,
                        none_map,
                        questions[questionIdx].mapMode,
                      ),
                    },
                    isSelected: {
                      table: isCellSelected,
                    },
                    setIsCellSelected,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
