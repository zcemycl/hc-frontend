"use client";
import {
  PaginationBar,
  TypographyH2,
  setup_selectable_cell_map,
  setup_selectable_col_map,
  setup_selectable_row_map,
} from "@/components";
import { fetchUnannotatedAETableByUserId } from "@/http/backend";
import { ProtectedRoute, useAuth } from "@/contexts";
import { Table } from "@/components";
import { IBaseTable, IUnAnnotatedAETable } from "@/types";
import { useState, useEffect } from "react";

export default function Page() {
  const { userId, credentials } = useAuth();
  const [tableData, setTableData] = useState<IUnAnnotatedAETable[]>([]);
  const [pageN, setPageN] = useState(0);
  const [nPerPage, _] = useState(10);
  const tabledata = [
    ["1", "2", "3", "a"],
    ["2", "3", "4", "b"],
    ["7", "7", "7", "c"],
  ];
  const n_rows = tabledata.length;
  const n_cols = tabledata[0].length;
  const row_map = setup_selectable_row_map(n_rows, n_cols);
  const col_map = setup_selectable_col_map(n_rows, n_cols);
  const cell_map = setup_selectable_cell_map(n_rows, n_cols);
  const [isCellSelected, setIsCellSelected] = useState<boolean[][]>(
    Array.from({ length: n_rows }, () =>
      Array.from({ length: n_cols }, () => false),
    ),
  );

  useEffect(() => {
    async function getData(credentials: string, userId: number) {
      const credJson = JSON.parse(credentials);
      const res = await fetchUnannotatedAETableByUserId(
        userId,
        credJson.AccessToken,
        pageN * nPerPage,
        nPerPage,
      );
      setTableData(res);
      console.log(res);
    }
    if (credentials.length === 0) return;
    getData(credentials, userId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageN]);

  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh] overflow-y-scroll">
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-10 pt-10 pb-5 space-y-2">
            <div className="flex justify-between">
              <TypographyH2>How to annotate Adverse Effect Table?</TypographyH2>
            </div>
            <Table
              {...{
                content: {
                  table: tabledata,
                } as IBaseTable,
                isSelectable: {
                  table: cell_map,
                },
                isSelected: {
                  table: isCellSelected,
                },
                setIsCellSelected,
              }}
            />
          </div>
          {tableData.map((data) => {
            return (
              <button
                className="sm:w-1/2 flex flex-col 
                  w-screen px-10 py-1 space-y-2 mb-2
                  rounded text-white border-blue-400
                  border-2 hover:border-blue-800
                  hover:bg-blue-800"
                key={`${data.fdalabel.setid}-${data.idx}`}
              >
                <p className="leading-relaxed">
                  {data.fdalabel.tradename} [Table {data.idx}]
                </p>
              </button>
            );
          })}
          <div className="flex justify-center space-x-1 flex-wrap">
            <PaginationBar
              topN={tableData.length * 100}
              pageN={pageN}
              nPerPage={nPerPage}
              setPageN={(i: number) => {
                setPageN(i);
              }}
            />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
