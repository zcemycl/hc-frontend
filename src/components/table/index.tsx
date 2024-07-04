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

function isEmpty(array: any[][]): boolean {
  return Array.isArray(array) && (array.length == 0 || array.every(isEmpty));
}

const TableCell: FC<{
  children: ReactNode;
  rowid?: number;
  colid?: number;
  isSelectable?: boolean;
  isSelected?: boolean[][];
  setIsTableSelected?: Dispatch<SetStateAction<boolean[][]>>;
}> = ({
  children,
  rowid,
  colid,
  isSelectable,
  isSelected,
  setIsTableSelected,
}) => {
  return (
    <td className="border">
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
  return (
    <table key={id}>
      <tbody key={id}>
        {tabledata!.content.table!.map((tablerow, rowid) => {
          return (
            <tr key={`${tablerow.join("-")}-${rowid}`}>
              {tablerow.map((tdata, dataid) => {
                return (
                  <TableCell
                    key={`${tdata}-${dataid}`}
                    rowid={rowid}
                    colid={dataid}
                    isSelectable={tabledata.isSelectable?.table[rowid][dataid]}
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
};
