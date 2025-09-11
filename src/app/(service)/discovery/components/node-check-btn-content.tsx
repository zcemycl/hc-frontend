import { VisibilityBtn } from "@/components";
import { SideCopyBtn } from "./side-copy-btn";
import { IEdge, INode, IVisibilityMap } from "@/types";
import { DiscoveryContext, LocalUtilityContext } from "@/contexts";
import { useContext } from "react";
import { FLOWER_ICON_URI } from "@/icons/bootstrap";

export const NodeCheckBtnContent = ({ v }: { v: INode }) => {
  const { hiddenNodes, setHiddenNodes, dNodes, edges, net } =
    useContext(DiscoveryContext);
  const { utilities } = useContext(LocalUtilityContext);
  const { move_network, trace_node_callback } = utilities;

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
            if (cur) {
              move_network(net, v.id);
              trace_node_callback(v.id, net);
            }
            setHiddenNodes((prev: IVisibilityMap) => {
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
            const nearNodeIds = edges
              .filter((e: IEdge) => e.from === v.id || e.to === v.id)
              .map((e: IEdge) => {
                if (e.to === v.id) return e.from;
                else return e.to;
              });
            let tmpHiddenNodes = structuredClone(hiddenNodes);
            nearNodeIds.forEach((i: number) => {
              tmpHiddenNodes[i] = false;
              dNodes.update({ id: i, hidden: false });
            });
            setHiddenNodes(tmpHiddenNodes);
          }}
        >
          <img src={FLOWER_ICON_URI} />
        </button>
      </span>
    </p>
  );
};
