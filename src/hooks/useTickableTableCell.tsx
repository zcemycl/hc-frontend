import {
  setup_selectable_row_map,
  setup_selectable_col_map,
  setup_selectable_cell_map,
  setup_selectable_none_map,
} from "@/utils";
import { useMemo } from "react";

const useTickableTableCell = ({
  n_rows,
  n_cols,
}: {
  n_rows: number;
  n_cols: number;
}) => {
  const row_map = useMemo(
    () => setup_selectable_row_map(n_rows, n_cols),
    [n_rows, n_cols],
  );
  const col_map = useMemo(
    () => setup_selectable_col_map(n_rows, n_cols),
    [n_rows, n_cols],
  );
  const cell_map = useMemo(
    () => setup_selectable_cell_map(n_rows, n_cols),
    [n_rows, n_cols],
  );
  const none_map = useMemo(
    () => setup_selectable_none_map(n_rows, n_cols),
    [n_rows, n_cols],
  );
  return { row_map, col_map, cell_map, none_map };
};

export { useTickableTableCell };
