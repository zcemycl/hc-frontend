"use client";

import { useState } from "react";

export default function VisToolbar() {
  const [openToolBar, setOpenToolBar] = useState<boolean>(false);
  return (
    <>
      <button
        className="rounded-lg
                    p-3
                    self-end
                    w-fit
                    text-black leading-5 font-semibold
                    bg-emerald-400 hover:bg-emerald-600"
        onClick={(e) => {
          e.preventDefault();
          setOpenToolBar(!openToolBar);
        }}
      >
        Toolbar
      </button>
      <div
        className={`origin-top-right transition
                    bg-sky-800 rounded-lg
                    self-end
                    w-[20vw]
                    ${
                      openToolBar ? "p-5 h-[60vh] scale-100" : "p-0 h-0 scale-0"
                    }`}
      ></div>
    </>
  );
}
