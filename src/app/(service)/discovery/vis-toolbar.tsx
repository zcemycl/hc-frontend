"use client";

import { graph_node_bg_color_enum } from "@/constants";
import { INode } from "@/types";
import { useState } from "react";

const switch_color_node = (group: string) => {
  switch (group) {
    case "ta":
      return `bg-[${graph_node_bg_color_enum.ta}]`;
    case "p":
      return "bg-sky-500";
    default:
      return "bg-white";
  }
};

export default function VisToolbar({
  selectedNodes,
}: {
  selectedNodes: INode[];
}) {
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
            flex flex-col space-y-1
            w-[80vw] sm:w-[45vw] md:w-[30vw]
            ${openToolBar ? "p-5 h-[60vh] scale-100" : "p-0 h-0 scale-0"}`}
      >
        <h2 className="leading text-slate-300 font-bold">Therapeutic Area</h2>
        <input
          type="text"
          className="bg-white text-black w-full rounded-lg h-10 p-2"
          onChange={(e) => {
            e.preventDefault();
            console.log(e.target.value);
          }}
        />
        {selectedNodes.map((v) => {
          return (
            <div
              className={`text-black 
                        rounded-lg p-2 
                        ${switch_color_node(v.group!)}`}
              key={v.id}
            >
              <p className="font-bold">Name: {v.label}</p>
              <p className="font-bold">Level: {v.level}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
