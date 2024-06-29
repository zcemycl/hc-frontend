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

interface ITableProps extends IBaseTableNoHead {}

const Table = (tabledata: ITableProps) => {
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

export { TableCell, TableHeadCell, Table };
