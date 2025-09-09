import { Table } from "@/components";
import { useTickableTableCell } from "@/hooks";
import { IAdverseEffectTable, IBaseTable } from "@/types";
import { switch_map } from "@/utils";
import { Dispatch, SetStateAction } from "react";

export const AnnotateTable = ({
  tableData,
  mapMode,
  isCellSelected,
  setIsCellSelected,
}: {
  tableData: IAdverseEffectTable;
  mapMode: string;
  isCellSelected: boolean[][];
  setIsCellSelected: Dispatch<SetStateAction<boolean[][]>>;
}) => {
  const n_rows = tableData?.content.table.length ?? 0;
  const n_cols = tableData?.content.table[0].length ?? 0;
  const { row_map, col_map, cell_map, none_map } = useTickableTableCell({
    n_rows,
    n_cols,
  });
  return (
    <div
      className="overflow-x-auto 
            flex flex-col w-full"
    >
      {tableData && (
        <Table
          {...{
            content: {
              table: tableData.content.table,
            } as IBaseTable,
            keyname: "table",
            isSelectable: {
              table: switch_map(row_map, cell_map, col_map, none_map, mapMode),
            },
            isSelected: {
              table: isCellSelected,
            },
            setIsCellSelected,
          }}
        />
      )}
    </div>
  );
};
