import { useContext } from "react";
import { DiscoveryContext } from "@/contexts";
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

const switch_hover_color_node = (group: string) => {
  switch (group) {
    case "ta":
      return `hover:bg-purple-400`;
    case "p":
      return "hover:bg-sky-700";
    default:
      return "hover:bg-white";
  }
};

export default function InfoTab() {
  const { selectedNodes, tab, visJsRef, net } = useContext(DiscoveryContext);
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
                rounded-lg p-2 cursor-pointer
                ${switch_hover_color_node(v.group!)}
                ${switch_color_node(v.group!)}`}
              key={v.id}
              onClick={(e) => {
                e.preventDefault();
                if (visJsRef.current) {
                  net.releaseNode();
                  const targetNodeId = selectedNodes.filter(
                    (x: INode) => x.id === v.id,
                  )[0].id;
                  const pos = net.getViewPosition();
                  // const pos = net.getPositions(targetNodeId);
                  net.moveTo({
                    position: pos,
                    scale: 0.2,
                    animation: {
                      duration: 800,
                    },
                  });
                  setTimeout(() => {
                    net.focus(targetNodeId, {
                      scale: 0.5,
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
                  <img
                    src="https://icons.getbootstrap.com/assets/icons/copy.svg"
                    alt="copy"
                  />
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
          No Node Selected...
        </div>
      )}
    </div>
  );
}
