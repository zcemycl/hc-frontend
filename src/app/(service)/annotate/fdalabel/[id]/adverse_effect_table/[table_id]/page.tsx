"use client";
import { ProtectedRoute, useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchAETableByIds } from "@/http/backend";
import { IAdverseEffectTable, IBaseTable } from "@/types";
import {
  Table,
  setup_selectable_cell_map,
  DropDownBtn,
  DropDownList,
  setup_selectable_row_map,
  setup_selectable_col_map,
  switch_map,
  Spinner,
} from "@/components";
import { questions } from "./questions";

interface PageProps {
  params: {
    id: string;
    table_id: number;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { credentials } = useAuth();
  const [questionIdx, setQuestionIdx] = useState(5);
  const [tableData, setTableData] = useState<IAdverseEffectTable | null>(null);
  const n_rows = tableData?.content.table.length ?? 0;
  const n_cols = tableData?.content.table[0].length ?? 0;
  const row_map = setup_selectable_row_map(n_rows, n_cols);
  const col_map = setup_selectable_col_map(n_rows, n_cols);
  const cell_map = setup_selectable_cell_map(n_rows, n_cols);
  const [isCellSelected, setIsCellSelected] = useState<boolean[][]>(
    Array.from({ length: n_rows }, () =>
      Array.from({ length: n_cols }, () => false),
    ),
  );
  const [finalResults, setFinalResults] = useState<{ [key: string]: any }>({});
  const [selectedOption, setSelectedOption] = useState("");
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // set table
  useEffect(() => {
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      const res = await fetchAETableByIds(
        params.table_id,
        params.id,
        credJson.AccessToken,
      );
      console.log(res);
      setTableData(res);
    }
    if (credentials.length === 0) return;
    setIsLoading(true);
    getData(credentials);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set selected table dimension when table is ready
  useEffect(() => {
    let newSelected = Array.from({ length: n_rows }, () =>
      Array.from({ length: n_cols }, () => false),
    );
    setIsCellSelected(newSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  useEffect(() => {
    console.log(isCellSelected);
  }, [isCellSelected]);

  useEffect(() => {
    if ("additionalRequire" in questions[questionIdx]) {
      const newDefaultOption =
        questions[questionIdx].additionalRequire![0].defaultOption;
      console.log(newDefaultOption);
      setSelectedOption(newDefaultOption);
    }
  }, [questionIdx]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]
        overflow-y-scroll overflow-x-scroll ${isLoading ? "animate-pulse" : ""}`}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          {isLoading && (
            <div
              role="status"
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
                Annotation
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
                {questions.map((q, idx) => {
                  return (
                    <span
                      className={`relative flex ${questionIdx === idx ? "h-3 w-3" : "h-2 w-2"}`}
                      key={q.displayName}
                      onClick={() => {
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
              </div>
            </div>

            <p className="leading-none w-full text-white">
              {questions[questionIdx].displayName}
            </p>
            {"additionalRequire" in questions[questionIdx] && (
              <div>
                <DropDownBtn
                  extraClassName="justify-end w-full
                  bg-blue-500 hover:bg-blue-700
                  text-black"
                  onClick={() => {
                    setIsOptionDropdownOpen(!isOptionDropdownOpen);
                  }}
                >
                  {questions[questionIdx].additionalRequire![0].displayName}:{" "}
                  {
                    questions[questionIdx].additionalRequire![0].options.filter(
                      (each) => each.type === selectedOption,
                    )[0]?.displayName!
                  }
                </DropDownBtn>
                <div className="flex w-full justify-end h-0">
                  <DropDownList
                    selected={selectedOption}
                    displayNameKey="displayName"
                    selectionKey="type"
                    allOptions={
                      questions[questionIdx].additionalRequire![0].options
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
              </div>
            )}

            <div className="overflow-x-scroll flex flex-col w-full">
              {tableData && (
                <Table
                  {...{
                    content: {
                      table: tableData.content.table,
                    } as IBaseTable,
                    isSelectable: {
                      table: switch_map(
                        row_map,
                        cell_map,
                        col_map,
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
