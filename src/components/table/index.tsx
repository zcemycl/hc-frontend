"use client";
import { FC, ReactNode } from "react";

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

export { TableCell, TableHeadCell };
