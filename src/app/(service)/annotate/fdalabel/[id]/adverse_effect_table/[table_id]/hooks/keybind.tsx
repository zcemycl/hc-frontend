import { useEffect, useRef } from "react";

export const useKeyBind = ({
  maxPage,
  pageN,
  setPageN,
}: {
  maxPage: number;
  pageN: number;
  setPageN: (i: number) => void;
}) => {
  const bufferRef = useRef(""); // stores digits typed
  const timeoutRef = useRef<number>();

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
      } else if (/^\d$/.test(e.key)) {
        // build up buffer of digits
        bufferRef.current += e.key;

        // clear old timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // apply after short pause
        timeoutRef.current = window.setTimeout(() => {
          const num = parseInt(bufferRef.current, 10) - 1;
          if (num < 0) return;
          if (!isNaN(num)) {
            if (maxPage !== undefined) {
              setPageN(Math.min(maxPage - 1, num));
            } else {
              setPageN(num);
            }
          }
          bufferRef.current = ""; // reset after use
        }, 200); // half-second delay for multi-digit input
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageN, setPageN, maxPage]);
};
