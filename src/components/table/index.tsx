"use client";
import { FC, ReactNode, useId } from "react";
import { IBaseTableNoHead } from "@/types";

const TableCell: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return <td className="border">{children}</td>;
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
                  <TableCell key={`${tdata}-${dataid}`}>{tdata}</TableCell>
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
  return (
    <table>
      <tbody>
        <tr>
          {Object.values(keyvalue).map((displayName: string, idx: number) => {
            return <TableHeadCell key={idx}>{displayName}</TableHeadCell>;
          })}
        </tr>
        {data[Object.keys(keyvalue)[0] as string].map((val, idx) => {
          return (
            <tr key={idx}>
              {Object.keys(keyvalue).map((key, idx_key) => {
                return <TableCell key={idx_key}>{data[key][idx]}</TableCell>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export { TableCell, TableHeadCell, Table, TableFromCols };
