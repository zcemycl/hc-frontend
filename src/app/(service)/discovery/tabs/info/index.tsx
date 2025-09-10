import { useContext } from "react";
import { DiscoveryContext } from "@/contexts";
import { INode } from "@/types";
import { GraphTabEnum } from "@/constants";
import { switch_color_node, switch_hover_color_node } from "../../utils";
import { useDiscoveryGraph } from "@/hooks";
import { SideCopyBtn } from "../../components";
import { VisibilityBtn } from "@/components";

export default function InfoTab() {
  const {
    selectedNodes,
    tab,
    visJsRef,
    net,
    dNodes,
    hiddenNodes,
    setHiddenNodes,
  } = useContext(DiscoveryContext);
  const { move_network } = useDiscoveryGraph();
  return (
    <div
      className={`absolute
        left-0 right-0 top-0 bottom-0
        self-end
        space-y-1
        overflow-y-auto
        w-full h-full
        transition
        p-5
        ${
          tab === GraphTabEnum.information
            ? "opacity-100 z-10 delay-200"
            : "opacity-0 z-0 duration-200"
        }
        `}
    >
      <h2 className="leading text-slate-300 font-bold">Inspect Path</h2>
      {selectedNodes.length !== 0 ? (
        selectedNodes.map((v: INode) => {
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
                  const targetNodeId = v.id;
                  move_network(net, targetNodeId);
                }
              }}
            >
              <p className="font-bold">
                Level {v.level}:{" "}
                <span id={`label-${v.id}`} className="inline">
                  {v.label}{" "}
                </span>
                <span className="inline-flex items-center space-x-1 align-middle">
                  <SideCopyBtn v={v} />
                  <button
                    className={`
                    px-1 rounded-lg shadow-md
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
                    <VisibilityBtn
                      isHidden={hiddenNodes[v.id]}
                      isShowText={false}
                    />
                  </button>
                </span>
              </p>
            </div>
          );
        })
      ) : (
        <div
          className="font-bold bg-amber-500 
              text-black rounded-lg p-2"
        >
          No Node Selected...
        </div>
      )}
    </div>
  );
}
