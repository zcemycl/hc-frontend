"use client";
import {
  TypographyH2,
  setup_selectable_cell_map,
  setup_selectable_col_map,
  setup_selectable_row_map,
} from "@/components";
import { ProtectedRoute, useAuth } from "@/contexts";
import { Table } from "@/components";
import { IBaseTable } from "@/types";
import { useState, useEffect } from "react";

export default function Page() {
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
    console.log(isCellSelected);
  }, [isCellSelected]);

  return (
    // <ProtectedRoute>
    <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh] overflow-y-scroll">
      <div className="container px-2 py-24 mx-auto grid justify-items-center">
        <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-10 pt-10 pb-5">
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
      </div>
    </section>
    // </ProtectedRoute>
  );
}
