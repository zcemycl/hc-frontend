"use client";
import { GraphTabEnum } from "@/constants";
import { DiscoveryContext } from "@/contexts";
import { useContext, useState, useMemo } from "react";
import { switch_color_node, switch_hover_color_node } from "./utils";
import { INode } from "@/types";
import { COPY_ICON_URI } from "@/icons/bootstrap";

export default function FilterTab() {
  const { tab, visJsRef, net, nodes, visToolBarRef } =
    useContext(DiscoveryContext);
  const [term, setTerm] = useState("");

  const filterNodes = useMemo(() => {
    return nodes
      .filter((v: INode) => v["label"].toLowerCase().includes(term))
      .slice(0, 5);
  }, [term]);

  return (
    <div
      className={`absolute
                left-0 right-0 top-0 bottom-0
                self-end
                space-y-2
                overflow-y-auto
                w-full h-full
                transition
                p-5
                ${
                  tab === GraphTabEnum.filters
                    ? "opacity-100 z-10 delay-200"
                    : "opacity-0 z-0 duration-200"
                }
                `}
    >
      <h2 className="leading text-slate-300 font-bold">Filters</h2>
      <div
        className="flex flex-col space-y-1
                justify-between
                p-2 rounded-lg
                content-center align-middle items-center
                bg-amber-500
                "
      >
        <div
          className="flex flex-row justify-start
                        text-left content-start items-start w-full"
        >
          <span className="text-black font-bold">Keyword</span>
        </div>

        <input
          value={term}
          onChange={(e) => {
            e.preventDefault();
            setTerm(e.target.value.toLowerCase());
          }}
          className={`w-full
                            p-2 bg-slate-100 text-black rounded-lg
                            `}
          type="input"
        />
      </div>
      <hr className="mb-2" />
      {filterNodes.length !== 0 ? (
        filterNodes.map((v: INode) => {
          return (
            <div
              className={`text-black
                                rounded-lg p-2 cursor-pointer
                                ${switch_hover_color_node(v.group!)}
                                ${switch_color_node(v.group!)}`}
              key={v.id}
              onClick={(e) => {
                e.preventDefault();
                if (visJsRef.current) {
                  net.releaseNode();
                  const targetNodeId = filterNodes.filter(
                    (x: INode) => x.id === v.id,
                  )[0].id;
                  //   const pos = net.getViewPosition();
                  const pos = net.getPositions([targetNodeId])[targetNodeId];
                  const { width: offsetx, height: offsety } = (
                    visToolBarRef.current as any
                  ).getBoundingClientRect();
                  const offset = { x: offsety > 60 ? -offsetx / 2 : 0, y: 0 };
                  net.moveTo({
                    position: pos,
                    scale: 0.2,
                    offset: offset,
                    animation: {
                      duration: 800,
                    },
                  });
                  net.selectNodes([targetNodeId]);
                  setTimeout(() => {
                    net.focus(targetNodeId, {
                      scale: 0.5,
                      offset,
                      animation: {
                        duration: 800,
                      },
                    });
                  }, 1500);
                }
              }}
            >
              <p
                className="font-bold
                                items-center content-center align-middle"
              >
                Level {v.level}: <span id={`label-${v.id}`}>{v.label} </span>
                <button
                  className={`content-center items-center align-middle
                                  rounded-md ${switch_color_node(v.group!)}
                                  z-10
                                  h-full p-1 ${switch_hover_color_node(v.group!)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const spanEle = document.getElementById(
                      `label-${v.id}`,
                    )?.innerHTML;
                    navigator.clipboard.writeText(spanEle?.trim() as string);
                  }}
                >
                  <img src={COPY_ICON_URI} alt="copy" />
                </button>
              </p>
            </div>
          );
        })
      ) : (
        <div
          className="font-bold bg-amber-500 
                              text-black rounded-lg p-2"
        >
          No Keyword Filter...
        </div>
      )}
    </div>
  );
}
