import { useEffect } from "react";

export const useKeyBind = ({
  maxPage,
  pageN,
  setPageN,
}: {
  maxPage: number;
  pageN: number;
  setPageN: (i: number) => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setPageN(Math.max(0, pageN - 1)); // don’t go below 0
      } else if (e.key === "ArrowRight") {
        if (maxPage !== undefined) {
          setPageN(Math.min(maxPage - 1, pageN + 1)); // clamp to max
        } else {
          setPageN(pageN + 1); // no max, just increment
        }
      }
      if (Number(e.key) >= 1 && Number(e.key) <= maxPage) {
        setPageN(Number(e.key) - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageN, setPageN, maxPage]);
};
