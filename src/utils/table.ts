const setup_selectable_row_map = (n_rows: number, n_cols: number) => {
  let tmp = Array.from({ length: n_rows }, () =>
    Array.from({ length: n_cols }, () => false),
  );
  for (let i = 0; i < n_rows; i++) {
    tmp[i][0] = true;
  }
  return tmp;
};

const setup_selectable_col_map = (n_rows: number, n_cols: number) => {
  let tmp = Array.from({ length: n_rows }, () =>
    Array.from({ length: n_cols }, () => false),
  );
  for (let i = 0; i < n_cols; i++) {
    tmp[0][i] = true;
  }
  return tmp;
};

const setup_selectable_cell_map = (n_rows: number, n_cols: number) => {
  return Array.from({ length: n_rows }, () =>
    Array.from({ length: n_cols }, () => true),
  );
};

const setup_selectable_none_map = (n_rows: number, n_cols: number) => {
  return Array.from({ length: n_rows }, () =>
    Array.from({ length: n_cols }, () => false),
  );
};

const switch_map = (
  row_map: boolean[][],
  cell_map: boolean[][],
  col_map: boolean[][],
  none_map: boolean[][],
  type: string,
) => {
  switch (type) {
    case "cell":
      return cell_map;
    case "row":
      return row_map;
    case "col":
      return col_map;
    case "none":
      return none_map;
    default:
      return cell_map;
  }
};

function isEmpty(array: any[][]): boolean {
  return Array.isArray(array) && (array.length == 0 || array.every(isEmpty));
}

export {
  setup_selectable_cell_map,
  setup_selectable_col_map,
  setup_selectable_none_map,
  setup_selectable_row_map,
  switch_map,
  isEmpty,
};
