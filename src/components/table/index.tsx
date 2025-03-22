"use client";
import {
  Dispatch,
  FC,
  Fragment,
  ReactNode,
  SetStateAction,
  useId,
  useRef,
} from "react";
import { IBaseTableNoHead, IBaseTable, IBaseSelectTable } from "@/types";

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

const TableCell: FC<{
  children: ReactNode;
  rowid?: number;
  colid?: number;
  colspan?: number;
  fontText?: boolean;
  isLeftBorderBold?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean[][];
  setIsTableSelected?: Dispatch<SetStateAction<boolean[][]>>;
}> = ({
  children,
  rowid,
  colid,
  colspan,
  fontText,
  isLeftBorderBold,
  isSelectable,
  isSelected,
  setIsTableSelected,
}) => {
  return (
    <td
      className={`border 
      ${isLeftBorderBold ? "border-l-4" : ""}`}
      colSpan={colspan === undefined ? 1 : colspan}
    >
      <div
        className={`flex justify-between px-2
        ${fontText! ? "font-bold" : ""}`}
      >
        {children}
        {isSelectable && (
          <input
            type="checkbox"
            key={Math.random()}
            // checked={isSelected![rowid][colid]}
            defaultChecked={
              isEmpty(isSelected as boolean[][])
                ? false
                : isSelected![rowid!][colid!]
            }
            onChange={(e) => {
              e.preventDefault();
              let copy = [...isSelected!];
              copy[rowid!][colid!] = !copy[rowid!][colid!];
              setIsTableSelected!(copy);
            }}
          />
        )}
      </div>
    </td>
  );
};

const TableHeadCell: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return <th className="border">{children}</th>;
};

const Table = (tabledata: IBaseTableNoHead) => {
  const id = useId();
  if (tabledata.keyname === undefined) {
    return <></>;
  }
  console.log(tabledata.keyname ?? "table");
  const tableRef = useRef<HTMLTableElement>(null);
  const isDisplayMode =
    tabledata.isSelectable === undefined
      ? true
      : !tabledata.isSelectable?.table.flat().includes(true);
  let drugHeading: string[] = [];
  let head_colspan: number[] = [];
  if (tabledata!.content[tabledata.keyname ?? "table"]!.length !== 0) {
    drugHeading = tabledata!.content[tabledata.keyname ?? "table"][0];
  }
  if (tabledata!.content[tabledata.keyname ?? "table"]!.length !== 0) {
    for (
      let j = 0;
      j < tabledata!.content[tabledata.keyname ?? "table"][0].length;
      j++
    ) {
      if (j === 0) {
        head_colspan = [...head_colspan, 1];
      } else {
        if (
          tabledata!.content[tabledata.keyname ?? "table"][0][j - 1] ===
          tabledata!.content[tabledata.keyname ?? "table"][0][j]
        ) {
          head_colspan[head_colspan.length - 1]++;
        } else {
          head_colspan = [...head_colspan, 1];
        }
      }
    }
  }
  const head_edge_idx = head_colspan.reduce((acc: number[], curr, i) => {
    acc.push((i === 0 ? 0 : acc[i - 1]) + curr);
    return acc;
  }, []);

  return (
    <>
      <button
        className="p-3 rounded-lg 
      bg-sky-300 hover:bg-sky-600
      font-bold text-black"
        onClick={(e) => {
          e.preventDefault();
          const table = document.querySelector("table"); // Get table
          let text = "";

          for (let row of Array.from(table!.rows)) {
            let rowData = [];

            for (let cell of Array.from(row!.cells)) {
              const colspan = cell.colSpan; // Get colspan value
              const cellText = cell.innerText.trim(); // Clean text

              // Add the cell text and repeat for colspan
              rowData.push(cellText);
              for (let i = 1; i < colspan; i++) {
                rowData.push(""); // Insert empty columns for correct structure
              }
            }

            text += rowData.join("\t") + "\n"; // Use tab delimiter for Excel/Sheets
          }
          navigator.clipboard.writeText(text);
        }}
      >
        COPY
      </button>
      <table key={id} ref={tableRef}>
        <tbody key={id}>
          {tabledata!.content[tabledata.keyname ?? "table"]!.map(
            (tablerow, rowid) => {
              let group_rowcell: string[] = [];
              let group_colspan_rowcell: number[] = [];
              let group_selectable_rowcell: boolean[] | undefined = [];

              if (isDisplayMode) {
                for (let i = 0; i < tablerow.length; i++) {
                  if (i === 0) {
                    group_rowcell = [...group_rowcell, tablerow[i]];
                    group_colspan_rowcell = [...group_colspan_rowcell, 1];
                  } else {
                    if (
                      group_rowcell[group_rowcell.length - 1] === tablerow[i]
                    ) {
                      group_colspan_rowcell[group_colspan_rowcell.length - 1]++;
                    } else {
                      group_rowcell = [...group_rowcell, tablerow[i]];
                      group_colspan_rowcell = [...group_colspan_rowcell, 1];
                    }
                  }
                }
                group_selectable_rowcell = Array.from(
                  { length: group_rowcell.length },
                  () => false,
                );
              } else {
                group_rowcell = tablerow;
                group_colspan_rowcell = Array.from(
                  { length: tablerow.length },
                  () => 1,
                );
                group_selectable_rowcell = tabledata.isSelectable?.table[rowid];
              }
              let copyDrugHeading = [...drugHeading];
              let prevEle = "";
              let curPopIdx = 0;
              const isBoldRow = group_rowcell.length === 1;

              return (
                <tr key={`${tablerow.join("-")}-${rowid}`}>
                  {group_rowcell.map((tdata, dataid) => {
                    let curEle;
                    let isInitAlignNewHead = head_edge_idx.includes(curPopIdx);
                    for (let k = 0; k < group_colspan_rowcell[dataid]; k++) {
                      curEle = copyDrugHeading.shift();
                      curPopIdx++;
                    }
                    let isBoldLeft = prevEle !== curEle && isInitAlignNewHead;
                    prevEle = curEle as string;

                    return (
                      <TableCell
                        key={`${tdata}-${dataid}`}
                        rowid={rowid}
                        colid={dataid}
                        colspan={group_colspan_rowcell[dataid]}
                        fontText={isBoldRow}
                        isLeftBorderBold={isBoldLeft}
                        isSelectable={
                          (group_selectable_rowcell as boolean[])[dataid]
                        }
                        isSelected={tabledata.isSelected?.table}
                        setIsTableSelected={tabledata.setIsCellSelected}
                      >
                        {tdata}
                      </TableCell>
                    );
                  })}
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </>
  );
};

interface IData {
  keyvalue: {
    [colname: string]: string;
  };
  data: {
    [colname: string]: string[];
  };
}

const TableFromCols = ({ keyvalue, data }: IData) => {
  const displayNames = Object.values(keyvalue);
  return (
    <table>
      <tbody>
        <tr>
          {displayNames.map((displayName: string) => {
            return (
              <TableHeadCell key={displayName}>{displayName}</TableHeadCell>
            );
          })}
        </tr>
        {data[Object.keys(keyvalue)[0] as string].map((val, idx) => {
          return (
            <tr key={`${displayNames[idx]}-${idx}`}>
              {Object.keys(keyvalue).map((key, idx_key) => {
                return (
                  <TableCell
                    rowid={idx}
                    colid={idx_key}
                    key={`${displayNames[idx]}-${idx}-${idx_key}`}
                  >
                    {data[key][idx]}
                  </TableCell>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export {
  TableCell,
  TableHeadCell,
  Table,
  TableFromCols,
  setup_selectable_row_map,
  setup_selectable_col_map,
  setup_selectable_cell_map,
  setup_selectable_none_map,
  switch_map,
};
