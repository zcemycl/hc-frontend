import { VisibilityBtn } from "@/components";
import { SideCopyBtn } from "./side-copy-btn";
import { INode } from "@/types";
import { DiscoveryContext } from "@/contexts";
import { useContext } from "react";
import { FLOWER_ICON_URI } from "@/icons/bootstrap";

export const NodeCheckBtnContent = ({ v }: { v: INode }) => {
  const { hiddenNodes, setHiddenNodes, dNodes } = useContext(DiscoveryContext);
  return (
    <p className="font-bold">
      Level {v.level}:{" "}
      <span id={`label-${v.id}`} className="inline">
        {v.label}{" "}
      </span>
      <span className="inline-flex items-center space-x-1 align-middle">
        <SideCopyBtn v={v} />
        <button
          className={`
                p-1 rounded-lg shadow-md
                ${
                  hiddenNodes[v.id]
                    ? "bg-teal-700 hover:bg-teal-300"
                    : "bg-teal-300 hover:bg-teal-700"
                }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const cur = hiddenNodes[v.id];
            dNodes.update({ id: v.id, hidden: !cur });
            setHiddenNodes((prev: Record<string, boolean>) => {
              let result = structuredClone(prev);
              result[v.id] = !result[v.id];
              return result;
            });
          }}
        >
          <VisibilityBtn isHidden={hiddenNodes[v.id]} isShowText={false} />
        </button>
        <button
          className="bg-amber-400 
                hover:bg-amber-600 
                rounded-lg p-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <img src={FLOWER_ICON_URI} />
        </button>
      </span>
    </p>
  );
};
