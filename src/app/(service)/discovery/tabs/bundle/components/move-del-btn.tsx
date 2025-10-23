import { INode } from "@/types";
import { switch_color_node, switch_hover_color_node } from "../../../utils";
import { X_CIRCLE_ICON_URI } from "@/icons/bootstrap";

export const MoveDelBtn = ({
  node,
  idx,
  click_callback,
  del_callback,
}: {
  node: INode;
  idx: number;
  click_callback: (vid: number | string) => void;
  del_callback: (vid: number | string, idx: number) => void;
}) => {
  return (
    <div
      className={`flex items-center rounded-lg
            overflow-visible
            ${switch_color_node(node.group as string)}
            ${switch_hover_color_node(node.group as string)}
            cursor-pointer
            h-8 px-3 py-1`}
    >
      <div
        className="relative w-full"
        onClick={(e) => {
          e.preventDefault();
          click_callback(node.id);
        }}
      >
        <div
          className={`text-black font-medium whitespace-nowrap
            transition-transform duration-1000`}
        >
          {node.label}
        </div>
        <button
          className="flex items-center justify-center
                absolute -top-2 -right-2
                rounded-full bg-red-400
                translate-x-2 z-10
                hover:bg-red-500 transition-colors"
          aria-label={`Remove ${node.label}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            del_callback(node.id, idx);
          }}
        >
          <img src={X_CIRCLE_ICON_URI} />
        </button>
      </div>
    </div>
  );
};
