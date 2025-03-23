"use client";
import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";

export default function VisPanel() {
  const [openToolBar, setOpenToolBar] = useState<boolean>(false);
  const visJsRef = useRef<HTMLDivElement>(null);
  const nodes = [
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
  ];

  const edges = [
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 },
  ];
  useEffect(() => {
    console.log(visJsRef);
    if (visJsRef.current) {
      const network =
        visJsRef.current &&
        new Network(
          visJsRef.current,
          { nodes, edges },
          {
            autoResize: true,
            edges: {
              color: "#FFFFFF",
            },
          },
        );
      network?.fit();
    }
  }, []);
  return (
    <div id="vis-panel" className="relative rounded-lg">
      <div
        ref={visJsRef}
        style={{ height: "78vh", width: "100%" }}
        className="w-full h-full absolute
                z-0
                rounded-lg
                border-2 border-solid
                border-purple-700
                left-0 right-0 top-0 bottom-0"
      />
      <div
        id="vis-toolbar"
        className="absolute right-0 top-0 
                    flex flex-col
                    z-10
                    space-y-2"
      >
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
      </div>
    </div>
  );
}
