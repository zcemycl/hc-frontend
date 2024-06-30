"use client";
import { FC, ReactNode } from "react";
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
  return (
    <table>
      <tbody>
        {tabledata!.content.table!.map((tablerow, rowid) => {
          return (
            <tr key={rowid}>
              {tablerow.map((tdata, dataid) => {
                return <TableCell key={dataid}>{tdata}</TableCell>;
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

const TableFromCols = ({ data }: { data: IData }) => {
  return (
    <table>
      <tbody>
        <tr>
          {Object.values(data.keyvalue).map(
            (displayName: string, idx: number) => {
              return <TableHeadCell key={idx}>{displayName}</TableHeadCell>;
            },
          )}
        </tr>
        {data.data[Object.keys(data.keyvalue)[0] as string].map((val, idx) => {
          return (
            <tr key={idx}>
              {Object.keys(data.keyvalue).map((key, idx_key) => {
                return (
                  <TableCell key={idx_key}>{data.data[key][idx]}</TableCell>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export { TableCell, TableHeadCell, Table, TableFromCols };
