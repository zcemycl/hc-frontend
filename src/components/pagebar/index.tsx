"use client";
import { FC } from "react";
interface PaginationProps {
  topN: number;
  pageN: number;
  nPerPage: number;
  setPageN: (i: number) => void;
}

const PaginationBar: FC<PaginationProps> = ({
  topN,
  pageN,
  nPerPage,
  setPageN,
}) => {
  const buttons = [];
  for (let i = 0; i < Math.ceil(topN / nPerPage); i++) {
    buttons.push(
      <button
        key={i}
        onClick={() => setPageN(i)}
        className={`text-white
         ${pageN == i ? "bg-indigo-600" : ""}
         border-0 
         py-2 
         px-5 
         focus:outline-none 
         hover:bg-indigo-600 
         rounded 
         text-lg`}
      >
        {i + 1}
      </button>,
    );
  }
  return <>{...buttons}</>;
};

export default PaginationBar;
