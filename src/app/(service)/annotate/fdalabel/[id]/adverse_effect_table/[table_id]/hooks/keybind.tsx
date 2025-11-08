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
      let nextActionPage = pageN;
      if (e.key === "ArrowLeft") {
        nextActionPage = Math.max(0, pageN - 1);
      } else if (e.key === "ArrowRight") {
        nextActionPage = Math.min(maxPage - 1, pageN + 1);
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
          console.log("nn: ", num);
          if (!isNaN(num)) {
            nextActionPage = Math.min(maxPage - 1, num);
            nextActionPage = Math.max(0, nextActionPage);
            if (nextActionPage !== pageN) {
              setPageN(nextActionPage);
            }
          }
          bufferRef.current = ""; // reset after use
        }, 200); // half-second delay for multi-digit input
      }
      if (nextActionPage !== pageN) {
        setPageN(nextActionPage);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageN, setPageN, maxPage]);
};
