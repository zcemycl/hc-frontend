"use client";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
interface PaginationProps {
  topN: number;
  pageN: number;
  nPerPage: number;
  setPageN: (i: number) => void;
}

function getPagination(
  maxPages: number,
  currentPage: number,
  maxVisible: number = 7,
): number[] {
  if (maxPages <= maxVisible) {
    return Array.from({ length: maxPages }, (_, i) => i);
  }

  const pages = [0]; // always include first page (0)

  // How many middle slots remain after reserving first & last
  const middleSlots = maxVisible - 2;
  const half = Math.floor(middleSlots / 2);

  let start = currentPage - half;
  let end = currentPage + half;

  // Adjust when near the start
  if (start < 1) {
    start = 1;
    end = start + middleSlots - 1;
  }

  // Adjust when near the end
  if (end > maxPages - 2) {
    end = maxPages - 2;
    start = end - middleSlots + 1;
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  pages.push(maxPages - 1); // always include last page

  return pages;
}

const PaginationBar: FC<PaginationProps> = ({
  topN,
  pageN,
  nPerPage,
  setPageN,
}) => {
  const buttons = [];
  const maxNPages = Math.ceil(topN / nPerPage);
  const availableNs = getPagination(maxNPages, pageN, 10);
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

const PaginationBar2: FC<PaginationProps> = ({
  topN,
  pageN,
  nPerPage,
  setPageN,
}) => {
  const maxNPages = Math.ceil(topN / nPerPage);
  const availableNs = getPagination(maxNPages, pageN, 7);
  const currentPageIndex = availableNs.indexOf(pageN);

  const pageBtnRef = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateIndicatorPosition = () => {
    const btn = pageBtnRef.current[currentPageIndex];
    const indicator = indicatorRef.current;
    const container = containerRef.current;

    if (btn && indicator && container) {
      // Use getBoundingClientRect for more accurate positioning
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Calculate relative position
      const leftOffset = btnRect.left - containerRect.left;

      const borderOffset = 4;
      indicator.style.left = `${leftOffset - borderOffset}px`;
      indicator.style.top = `${-borderOffset}px`;
      indicator.style.width = `${btnRect.width + borderOffset * 2}px`;
      indicator.style.height = `${btnRect.height + borderOffset * 2}px`;
    }
  };

  useLayoutEffect(() => {
    // Add a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      updateIndicatorPosition();
    }, 0);

    return () => clearTimeout(timer);
  }, [pageN, currentPageIndex, availableNs]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updateIndicatorPosition();
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [pageN, currentPageIndex]);

  return maxNPages > 1 ? (
    <div
      className="flex
        w-full justify-center relative
        "
      ref={containerRef}
    >
      {maxNPages > 0 && (
        <div
          ref={indicatorRef}
          id="page-idx-loc"
          className="absolute
          border-emerald-200 border-2
          rounded-lg transition-all duration-300
          ease-out z-10 border-dashed
          bg-transparent"
        />
      )}

      <div className="flex flex-row justify-center space-x-2">
        {availableNs.map((i, idx) => {
          return (
            <button
              key={i}
              ref={(el) => (pageBtnRef.current[idx] = el)}
              onClick={(e) => {
                e.preventDefault();
                setPageN(i);
              }}
              className={`rounded-md py-1 px-2 font-bold
              transition-colors z-20
              ${
                pageN === i
                  ? "bg-emerald-700 text-white"
                  : "bg-emerald-400 text-black"
              }
              items-center justify-center flex`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};

export { PaginationBar, PaginationBar2 };
