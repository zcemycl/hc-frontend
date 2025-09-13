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
  click_callback: (vid: number) => void;
  del_callback: (vid: number, idx: number) => void;
}) => {
  return (
    <div
      className={`flex items-center rounded-lg
            truncate overflow-x-auto relative
            ${switch_color_node(node.group as string)}
            ${switch_hover_color_node(node.group as string)}
            cursor-pointer
            h-8 px-3 py-1`}
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
                absolute right-0 top-0
                rounded-full bg-red-400 
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
  );
};
