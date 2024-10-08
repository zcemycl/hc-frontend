"use client";
import { FC } from "react";
interface PaginationProps {
  topN: number;
  pageN: number;
  nPerPage: number;
  setPageN: (i: number) => void;
}

const availablePageNs = (pageN: number, maxNPages: number) => {
  const availableNs = [];
  if (maxNPages === 1) {
    return [];
  }
  if (maxNPages < 10) {
    return Array.from(Array(maxNPages).keys());
  }
  if (pageN >= 5 && pageN <= maxNPages - 4) {
    availableNs.push(0);
    for (let i = pageN - 3; i < pageN + 5; i++) {
      availableNs.push(i);
    }
    availableNs.push(maxNPages - 1);
  } else if (pageN < 5) {
    for (let i = 0; i < 8; i++) {
      availableNs.push(i);
    }
    availableNs.push(maxNPages - 2);
    availableNs.push(maxNPages - 1);
  } else if (pageN > maxNPages - 4) {
    availableNs.push(0);
    availableNs.push(1);
    for (let i = maxNPages - 8; i < maxNPages; i++) {
      availableNs.push(i);
    }
  }
  return availableNs;
};

const PaginationBar: FC<PaginationProps> = ({
  topN,
  pageN,
  nPerPage,
  setPageN,
}) => {
  const buttons = [];
  const maxNPages = Math.ceil(topN / nPerPage);
  const availableNs = availablePageNs(pageN, maxNPages);
  for (const i of availableNs) {
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
