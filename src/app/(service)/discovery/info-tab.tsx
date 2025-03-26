import { useContext } from "react";
import { DiscoveryContext } from "./context";
import { INode } from "@/types";

const switch_color_node = (group: string) => {
  switch (group) {
    case "ta":
      return `bg-purple-300`;
    case "p":
      return "bg-sky-500";
    default:
      return "bg-white";
  }
};

export default function InfoTab() {
  const { selectedNodes, tab } = useContext(DiscoveryContext);
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
                  tab === "info"
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
                            rounded-lg p-2
                            ${switch_color_node(v.group!)}`}
              key={v.id}
            >
              <p className="font-bold">
                Level {v.level}: {v.label}
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
