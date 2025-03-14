"use client";
import {
  Dispatch,
  FC,
  Fragment,
  ReactNode,
  SetStateAction,
  useId,
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
  isSelectable?: boolean;
  isSelected?: boolean[][];
  setIsTableSelected?: Dispatch<SetStateAction<boolean[][]>>;
}> = ({
  children,
  rowid,
  colid,
  colspan,
  isSelectable,
  isSelected,
  setIsTableSelected,
}) => {
  return (
    <td className="border" colSpan={colspan === undefined ? 1 : colspan}>
      <div className="flex justify-between px-2">
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
  const isDisplayMode =
    tabledata.isSelectable === undefined
      ? true
      : !tabledata.isSelectable?.table.flat().includes(true);
  console.log(isDisplayMode);
  return (
    <table key={id}>
      <tbody key={id}>
        {tabledata!.content.table!.map((tablerow, rowid) => {
          let group_rowcell: string[] = [];
          let group_colspan_rowcell: number[] = [];
          let group_selectable_rowcell: boolean[] | undefined = [];

          if (isDisplayMode) {
            for (let i = 0; i < tablerow.length; i++) {
              if (i === 0) {
                group_rowcell = [...group_rowcell, tablerow[i]];
                group_colspan_rowcell = [...group_colspan_rowcell, 1];
              } else {
                if (group_rowcell[group_rowcell.length - 1] === tablerow[i]) {
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
          console.log(group_rowcell);
          console.log(group_colspan_rowcell);

          return (
            <tr key={`${tablerow.join("-")}-${rowid}`}>
              {group_rowcell.map((tdata, dataid) => {
                return (
                  <TableCell
                    key={`${tdata}-${dataid}`}
                    rowid={rowid}
                    colid={dataid}
                    colspan={group_colspan_rowcell[dataid]}
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
        })}
      </tbody>
    </table>
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
