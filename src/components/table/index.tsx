"use client";
import { FC, ReactNode } from "react";

const TableCell: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return <td className="border">{children}</td>;
};

export { TableCell };
